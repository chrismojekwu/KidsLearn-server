BEGIN;

TRUNCATE
    kidslearn_users,
    kidslearn_reports
    RESTART IDENTITY CASCADE;

INSERT INTO kidslearn_users (user_name, password, email, child_name)
VALUES 
    ('Chris1','$2a$12$9tuC4.F3DR.xjvCO7W58JeUFHfG6RXRDcGL8pUmQLpoymFkTfWVHS','chris@email.com','Anwu'),
    ('Sheila','$2a$12$3VJNsxChDuHQ.ZfsyxbQIurhAH1Fc5GuFRs9OkOhdS4GZl3MxoXae','sheila@email.com','Tia'),
    ('mikenikeman','$2a$12$8qK37TS2HUUUM7RcBih8WOf78KtiFlOChbHeVWUaKVCJA1mCkPtcG','bishop@thelab.com','Jeff'),
    ('Martin','$2a$12$0xygU4YUzKY3/qDaDlpaHuHS61sBlmRiuEjijsBFUSHaqwk/m7K4K','martin@cameroon.com','Christine');

   
INSERT INTO kidslearn_reports (letters,colors,objects,animals,clothes,comments,user_id)
VALUES
    (20,10,5,18,7,'Tia did very well today', 2),    
    (2,12,2,1,9,'Anwu was not paying attention', 1),
    (18,11,5,3,7,'Christine had trouble with animals', 4),
    (16,18,19,20,20,'Anwu aced everything', 1),
    (16,12,6,1,7,'Jeff is still getting used to the site', 3),
    (20,10,5,18,7,'Christine made it all happen', 4);

COMMIT;
