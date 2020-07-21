CREATE TABLE kidslearn_users (
    id SERIAL PRIMARY KEY,
    user_name TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email VARCHAR NOT NULL,
    child_name TEXT NOT NULL,
    date_created TIMESTAMPTZ NOT NULL DEFAULT now(),
    date_modified TIMESTAMPTZ
);