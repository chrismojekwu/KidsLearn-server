CREATE TABLE kidslearn_reports (
    id SERIAL PRIMARY KEY,
    date_created TIMESTAMPTZ NOT NULL DEFAULT now(),
    letters INTEGER,
    colors INTEGER,
    objects INTEGER,
    animals INTEGER,
    clothes INTEGER,
    comments TEXT,
    user_id INTEGER 
        REFERENCES kidslearn_users(id) ON DELETE CASCADE NOT NULL
);