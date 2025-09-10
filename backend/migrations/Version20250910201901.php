<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250910201901 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE pinball (id SERIAL NOT NULL, title VARCHAR(255) NOT NULL, opdb_id VARCHAR(255) DEFAULT NULL, features JSON NOT NULL, description TEXT DEFAULT NULL, condition VARCHAR(20) NOT NULL, images JSON DEFAULT NULL, year INT DEFAULT NULL, manufacturer VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE pinball_owner (id SERIAL NOT NULL, owner_id INT DEFAULT NULL, pinball_id INT DEFAULT NULL, start_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, end_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_A31BA82D7E3C61F9 ON pinball_owner (owner_id)');
        $this->addSql('CREATE INDEX IDX_A31BA82D4BD1277E ON pinball_owner (pinball_id)');
        $this->addSql('COMMENT ON COLUMN pinball_owner.start_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN pinball_owner.end_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE pinball_owner ADD CONSTRAINT FK_A31BA82D7E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE pinball_owner ADD CONSTRAINT FK_A31BA82D4BD1277E FOREIGN KEY (pinball_id) REFERENCES pinball (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('CREATE SCHEMA tiger_data');
        $this->addSql('CREATE SCHEMA tiger');
        $this->addSql('CREATE SCHEMA topology');
        $this->addSql('ALTER TABLE pinball_owner DROP CONSTRAINT FK_A31BA82D7E3C61F9');
        $this->addSql('ALTER TABLE pinball_owner DROP CONSTRAINT FK_A31BA82D4BD1277E');
        $this->addSql('DROP TABLE pinball');
        $this->addSql('DROP TABLE pinball_owner');
    }
}
