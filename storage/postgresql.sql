CREATE DATABASE pilerun;

--\c means jump into DATABASE pilerun

CREATE TABLE betrothed (
    uid SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    source TEXT,
    startplay DECIMAL,
    volume DECIMAL 
    );  

-- under pilerun, type "\dt", you can see the TABLE under pilerun DATABASE
