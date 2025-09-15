<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250911205442 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE pinball ADD current_owner_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE pinball ADD CONSTRAINT FK_2D8B0FACE3441BD3 FOREIGN KEY (current_owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_2D8B0FACE3441BD3 ON pinball (current_owner_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('CREATE SCHEMA tiger_data');
        $this->addSql('CREATE SCHEMA tiger');
        $this->addSql('CREATE SCHEMA topology');
        $this->addSql('ALTER TABLE pinball DROP CONSTRAINT FK_2D8B0FACE3441BD3');
        $this->addSql('DROP INDEX IDX_2D8B0FACE3441BD3');
        $this->addSql('ALTER TABLE pinball DROP current_owner_id');
    }
}
