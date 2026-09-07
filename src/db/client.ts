import { Pool } from "pg";
import { Signer } from "@aws-sdk/rds-signer";
import dotenv from "dotenv";

dotenv.config();

const host = process.env.DB_HOST!;
const port = Number(process.env.DB_PORT || 5432);
const database = process.env.DB_NAME!;
const user = process.env.DB_USER!;

const useIam = process.env.DB_AUTH_MODE === "iam";

const signer = useIam
    ? new Signer({
        region: process.env.AWS_REGION || "us-east-1",
        hostname: host,
        port,
        username: user
    })
    : null;

export const pool = new Pool({
    host,
    port,
    database,
    user,

    password: useIam
        ? async () => signer!.getAuthToken()
        : process.env.DB_PASSWORD,

    ssl: useIam
        ? {
            rejectUnauthorized: false
        }
        : undefined
});