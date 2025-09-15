<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250915195911 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE pinball_sale (id SERIAL NOT NULL, pinball_id INT DEFAULT NULL, seller_id INT NOT NULL, buyer_id INT DEFAULT NULL, start_price NUMERIC(20, 2) NOT NULL, final_price NUMERIC(20, 2) DEFAULT NULL, devise VARCHAR(10) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, sold_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_98907C514BD1277E ON pinball_sale (pinball_id)');
        $this->addSql('CREATE INDEX IDX_98907C518DE820D9 ON pinball_sale (seller_id)');
        $this->addSql('CREATE INDEX IDX_98907C516C755722 ON pinball_sale (buyer_id)');
        $this->addSql('COMMENT ON COLUMN pinball_sale.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN pinball_sale.sold_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE pinball_sale ADD CONSTRAINT FK_98907C514BD1277E FOREIGN KEY (pinball_id) REFERENCES pinball (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE pinball_sale ADD CONSTRAINT FK_98907C518DE820D9 FOREIGN KEY (seller_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE pinball_sale ADD CONSTRAINT FK_98907C516C755722 FOREIGN KEY (buyer_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('CREATE SCHEMA tiger_data');
        $this->addSql('CREATE SCHEMA tiger');
        $this->addSql('CREATE SCHEMA topology');
        $this->addSql('ALTER TABLE pinball_sale DROP CONSTRAINT FK_98907C514BD1277E');
        $this->addSql('ALTER TABLE pinball_sale DROP CONSTRAINT FK_98907C518DE820D9');
        $this->addSql('ALTER TABLE pinball_sale DROP CONSTRAINT FK_98907C516C755722');
        $this->addSql('DROP TABLE pinball_sale');
    }
}
