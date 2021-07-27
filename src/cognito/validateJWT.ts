import * as Axios from 'axios';
import * as jsonwebtoken from 'jsonwebtoken';
const jwkToPem = require('jwk-to-pem');
import { config } from '../config';

export interface ClaimVerifyRequest {
    readonly token?: string;
}

export interface ClaimVerifyResult {
    readonly userName: string;
    readonly email: string;
    readonly isValid: boolean;
    readonly error?: any;
}

interface TokenHeader {
    kid: string;
    alg: string;
}
interface PublicKey {
    alg: string;
    e: string;
    kid: string;
    kty: string;
    n: string;
    use: string;
}
interface PublicKeyMeta {
    instance: PublicKey;
    pem: string;
}

interface PublicKeys {
    keys: PublicKey[];
}

interface MapOfKidToPublicKey {
    [key: string]: PublicKeyMeta;
}

interface Claim {
    token_use: string;
    auth_time: number;
    iss: string;
    exp: number;
    username: string;
    client_id: string;
    sub: string;
    email: string;
}

const cognitoPoolId = config.COGNITO_POOL_ID;
if (!cognitoPoolId) {
    throw new Error('env var required for cognito pool');
}
const cognitoIssuer = `https://cognito-idp.us-east-1.amazonaws.com/${cognitoPoolId}`;

let cacheKeys: MapOfKidToPublicKey | undefined;
const getPublicKeys = async (): Promise<MapOfKidToPublicKey> => {
    if (!cacheKeys) {
        const url = `${cognitoIssuer}/.well-known/jwks.json`;
        const publicKeys = await Axios.default.get<PublicKeys>(url);
        cacheKeys = publicKeys.data.keys.reduce((agg, current) => {
            const pem = jwkToPem(current);
            agg[current.kid] = { instance: current, pem };
            return agg;
        }, {} as MapOfKidToPublicKey);
        return cacheKeys;
    } else {
        return cacheKeys;
    }
};

const validateJWT = async (
    bearerToken: string | undefined
): Promise<ClaimVerifyResult> => {
    let result: ClaimVerifyResult = {
        userName: '',
        email: '',
        isValid: false,
    };
    try {
        if (!bearerToken) return result;
        const token = bearerToken.replace('Bearer ', '');
        const tokenSections = (token || '').split('.');
        if (tokenSections.length < 2) {
            throw new Error('requested token is invalid');
        }
        const headerJSON = Buffer.from(tokenSections[0], 'base64').toString(
            'utf8'
        );
        const header = JSON.parse(headerJSON) as TokenHeader;
        const keys = await getPublicKeys();
        const key = keys[header.kid];
        if (key === undefined) {
            throw new Error('claim made for unknown kid');
        }
        const claim = jsonwebtoken.verify(token, key.pem) as Claim;
        const currentSeconds = Math.floor(new Date().valueOf() / 1000);
        if (currentSeconds > claim.exp || currentSeconds < claim.auth_time) {
            throw new Error('claim is expired or invalid');
        }
        if (claim.iss !== cognitoIssuer) {
            throw new Error('claim issuer is invalid');
        }
        if (claim.token_use !== 'id') {
            throw new Error('claim use is not id');
        }
        result = {
            userName: claim.sub,
            email: claim.email,
            isValid: true,
        };
    } catch (error) {
        result = { userName: '', email: '', error, isValid: false };
    }
    return result;
};
export default validateJWT;
