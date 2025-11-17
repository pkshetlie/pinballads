<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251117205132 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE maintenance_log (id SERIAL NOT NULL, pinball_id INT NOT NULL, done_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, description TEXT NOT NULL, cost NUMERIC(15, 2) DEFAULT NULL, notes VARCHAR(255) DEFAULT NULL, parts VARCHAR(255) DEFAULT NULL, technician VARCHAR(255) DEFAULT NULL, type VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_26CA3DF34BD1277E ON maintenance_log (pinball_id)');
        $this->addSql('COMMENT ON COLUMN maintenance_log.done_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE maintenance_log ADD CONSTRAINT FK_26CA3DF34BD1277E FOREIGN KEY (pinball_id) REFERENCES pinball (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('CREATE SCHEMA tiger_data');
        $this->addSql('CREATE SCHEMA tiger');
        $this->addSql('CREATE SCHEMA topology');
        $this->addSql('ALTER TABLE maintenance_log DROP CONSTRAINT FK_26CA3DF34BD1277E');
        $this->addSql('DROP TABLE maintenance_log');
    }
}
