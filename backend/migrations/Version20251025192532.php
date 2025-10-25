<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251025192532 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE message (id SERIAL NOT NULL, sender_id INT DEFAULT NULL, recipient_id INT DEFAULT NULL, text TEXT NOT NULL, offer INT DEFAULT NULL, is_scam BOOLEAN DEFAULT NULL, scam_reason TEXT NOT NULL, score INT DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_B6BD307FF624B39D ON message (sender_id)');
        $this->addSql('CREATE INDEX IDX_B6BD307FE92F8F78 ON message (recipient_id)');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307FF624B39D FOREIGN KEY (sender_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307FE92F8F78 FOREIGN KEY (recipient_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE pinball_sale ALTER city TYPE TEXT');
        $this->addSql('ALTER TABLE "user" ADD is_verified BOOLEAN DEFAULT NULL');
        $this->addSql('ALTER TABLE "user" ADD geography geography(POINT, 4326) DEFAULT NULL');
        $this->addSql('ALTER TABLE "user" ADD settings JSONB DEFAULT NULL');
        $this->addSql('ALTER TABLE "user" ADD city TEXT DEFAULT NULL');
        $this->addSql('UPDATE "user" SET is_verified = false');
        $this->addSql('COMMENT ON COLUMN "user".settings IS \'(DC2Type:jsonb)\'');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('CREATE SCHEMA tiger_data');
        $this->addSql('CREATE SCHEMA tiger');
        $this->addSql('CREATE SCHEMA topology');
        $this->addSql('ALTER TABLE message DROP CONSTRAINT FK_B6BD307FF624B39D');
        $this->addSql('ALTER TABLE message DROP CONSTRAINT FK_B6BD307FE92F8F78');
        $this->addSql('DROP TABLE message');
        $this->addSql('ALTER TABLE "user" DROP is_verified');
        $this->addSql('ALTER TABLE "user" DROP geography');
        $this->addSql('ALTER TABLE "user" DROP settings');
        $this->addSql('ALTER TABLE "user" DROP city');
        $this->addSql('ALTER TABLE pinball_sale ALTER city TYPE VARCHAR(255)');
    }
}
