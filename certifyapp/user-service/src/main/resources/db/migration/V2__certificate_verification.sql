CREATE TYPE certificate_auth_status AS ENUM ('ISSUED', 'AUTHENTIC', 'REVOKED');

ALTER TABLE certificates
    ADD COLUMN title VARCHAR(255),
    ADD COLUMN verification_code VARCHAR(32),
    ADD COLUMN business_id UUID REFERENCES businesses (id) ON DELETE SET NULL,
    ADD COLUMN event_id UUID REFERENCES events (id) ON DELETE SET NULL,
    ADD COLUMN holder_name VARCHAR(255),
    ADD COLUMN holder_email VARCHAR(255),
    ADD COLUMN auth_status certificate_auth_status NOT NULL DEFAULT 'ISSUED',
    ADD COLUMN verified_at TIMESTAMPTZ,
    ADD COLUMN revoked_reason TEXT;

UPDATE certificates
SET verification_code = 'CERT-' || UPPER(SUBSTRING(REPLACE(id::text, '-', '') FROM 1 FOR 8))
WHERE verification_code IS NULL;

ALTER TABLE certificates
    ALTER COLUMN verification_code SET NOT NULL;

CREATE UNIQUE INDEX idx_certificates_verification_code ON certificates (verification_code);
CREATE INDEX idx_certificates_business_id ON certificates (business_id);
CREATE INDEX idx_certificates_event_id ON certificates (event_id);
CREATE INDEX idx_certificates_auth_status ON certificates (auth_status);
