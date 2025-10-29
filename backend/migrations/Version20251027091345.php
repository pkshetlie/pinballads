<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251027091345 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP SEQUENCE image_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE manufacturer_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE product_id_seq CASCADE');
        $this->addSql('CREATE TABLE conversation (id SERIAL NOT NULL, pinball_id INT NOT NULL, user_a_id INT DEFAULT NULL, user_b_id INT NOT NULL, last_message_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_8A8E26E94BD1277E ON conversation (pinball_id)');
        $this->addSql('CREATE INDEX IDX_8A8E26E9415F1F91 ON conversation (user_a_id)');
        $this->addSql('CREATE INDEX IDX_8A8E26E953EAB07F ON conversation (user_b_id)');
        $this->addSql('COMMENT ON COLUMN conversation.last_message_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE conversation ADD CONSTRAINT FK_8A8E26E94BD1277E FOREIGN KEY (pinball_id) REFERENCES pinball (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE conversation ADD CONSTRAINT FK_8A8E26E9415F1F91 FOREIGN KEY (user_a_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE conversation ADD CONSTRAINT FK_8A8E26E953EAB07F FOREIGN KEY (user_b_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE product DROP CONSTRAINT fk_d34a04ada23b42d');
        $this->addSql('ALTER TABLE image DROP CONSTRAINT fk_c53d045f4584665a');
        $this->addSql('DROP TABLE product');
        $this->addSql('DROP TABLE manufacturer');
        $this->addSql('DROP TABLE image');
        $this->addSql('ALTER TABLE message DROP CONSTRAINT fk_b6bd307f4bd1277e');
        $this->addSql('DROP INDEX idx_b6bd307f4bd1277e');
        $this->addSql('ALTER TABLE message RENAME COLUMN pinball_id TO conversation_id');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307F9AC0396 FOREIGN KEY (conversation_id) REFERENCES conversation (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_B6BD307F9AC0396 ON message (conversation_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('CREATE SCHEMA tiger_data');
        $this->addSql('CREATE SCHEMA tiger');
        $this->addSql('CREATE SCHEMA topology');
        $this->addSql('ALTER TABLE message DROP CONSTRAINT FK_B6BD307F9AC0396');
        $this->addSql('CREATE SEQUENCE image_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE manufacturer_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE product_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE product (id SERIAL NOT NULL, manufacturer_id INT DEFAULT NULL, title VARCHAR(255) NOT NULL, other_manufacturer VARCHAR(255) DEFAULT NULL, year INT DEFAULT NULL, condition VARCHAR(20) NOT NULL, description TEXT NOT NULL, price NUMERIC(10, 2) NOT NULL, city VARCHAR(255) NOT NULL, state VARCHAR(255) NOT NULL, zip VARCHAR(255) NOT NULL, phone VARCHAR(255) NOT NULL, delivery BOOLEAN NOT NULL, features JSON NOT NULL, is_in_collection BOOLEAN NOT NULL, is_on_sale BOOLEAN NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX idx_d34a04ada23b42d ON product (manufacturer_id)');
        $this->addSql('CREATE TABLE manufacturer (id SERIAL NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE image (id SERIAL NOT NULL, product_id INT NOT NULL, path VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX idx_c53d045f4584665a ON image (product_id)');
        $this->addSql('ALTER TABLE product ADD CONSTRAINT fk_d34a04ada23b42d FOREIGN KEY (manufacturer_id) REFERENCES manufacturer (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE image ADD CONSTRAINT fk_c53d045f4584665a FOREIGN KEY (product_id) REFERENCES product (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE conversation DROP CONSTRAINT FK_8A8E26E94BD1277E');
        $this->addSql('ALTER TABLE conversation DROP CONSTRAINT FK_8A8E26E9415F1F91');
        $this->addSql('ALTER TABLE conversation DROP CONSTRAINT FK_8A8E26E953EAB07F');
        $this->addSql('DROP TABLE conversation');
        $this->addSql('DROP INDEX IDX_B6BD307F9AC0396');
        $this->addSql('ALTER TABLE message RENAME COLUMN conversation_id TO pinball_id');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT fk_b6bd307f4bd1277e FOREIGN KEY (pinball_id) REFERENCES pinball (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_b6bd307f4bd1277e ON message (pinball_id)');
    }
}
