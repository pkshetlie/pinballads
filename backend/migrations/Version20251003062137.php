<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251003062137 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE pinball_collection (id SERIAL NOT NULL, owner_id INT DEFAULT NULL, description TEXT DEFAULT NULL, title VARCHAR(255) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_13190F5D7E3C61F9 ON pinball_collection (owner_id)');
        $this->addSql('CREATE TABLE pinball_collection_pinball (pinball_collection_id INT NOT NULL, pinball_id INT NOT NULL, PRIMARY KEY(pinball_collection_id, pinball_id))');
        $this->addSql('CREATE INDEX IDX_6231C62EE1D6CCCF ON pinball_collection_pinball (pinball_collection_id)');
        $this->addSql('CREATE INDEX IDX_6231C62E4BD1277E ON pinball_collection_pinball (pinball_id)');
        $this->addSql('ALTER TABLE pinball_collection ADD CONSTRAINT FK_13190F5D7E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE pinball_collection_pinball ADD CONSTRAINT FK_6231C62EE1D6CCCF FOREIGN KEY (pinball_collection_id) REFERENCES pinball_collection (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE pinball_collection_pinball ADD CONSTRAINT FK_6231C62E4BD1277E FOREIGN KEY (pinball_id) REFERENCES pinball (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE pinball ADD created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW()');
        $this->addSql('ALTER TABLE pinball ADD updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW()');
        $this->addSql('ALTER TABLE pinball_owner ADD created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW()');
        $this->addSql('ALTER TABLE pinball_owner ADD updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW()');
        $this->addSql('ALTER TABLE pinball_sale ADD updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL');
        $this->addSql('ALTER TABLE pinball_sale ALTER created_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE');
        $this->addSql('COMMENT ON COLUMN pinball_sale.created_at IS NULL');
        $this->addSql('ALTER TABLE "user" ADD created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW()');
        $this->addSql('ALTER TABLE "user" ADD updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW()');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('CREATE SCHEMA tiger_data');
        $this->addSql('CREATE SCHEMA tiger');
        $this->addSql('CREATE SCHEMA topology');
        $this->addSql('ALTER TABLE pinball_collection DROP CONSTRAINT FK_13190F5D7E3C61F9');
        $this->addSql('ALTER TABLE pinball_collection_pinball DROP CONSTRAINT FK_6231C62EE1D6CCCF');
        $this->addSql('ALTER TABLE pinball_collection_pinball DROP CONSTRAINT FK_6231C62E4BD1277E');
        $this->addSql('DROP TABLE pinball_collection');
        $this->addSql('DROP TABLE pinball_collection_pinball');
        $this->addSql('ALTER TABLE "user" DROP created_at');
        $this->addSql('ALTER TABLE "user" DROP updated_at');
        $this->addSql('ALTER TABLE pinball DROP created_at');
        $this->addSql('ALTER TABLE pinball DROP updated_at');
        $this->addSql('ALTER TABLE pinball_sale DROP updated_at');
        $this->addSql('ALTER TABLE pinball_sale ALTER created_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE');
        $this->addSql('COMMENT ON COLUMN pinball_sale.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE pinball_owner DROP created_at');
        $this->addSql('ALTER TABLE pinball_owner DROP updated_at');
    }
}
