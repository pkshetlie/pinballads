<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250908072354 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE image (id SERIAL NOT NULL, product_id INT NOT NULL, path VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_C53D045F4584665A ON image (product_id)');
        $this->addSql('CREATE TABLE manufacturer (id SERIAL NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE product (id SERIAL NOT NULL, manufacturer_id INT DEFAULT NULL, title VARCHAR(255) NOT NULL, other_manufacturer VARCHAR(255) DEFAULT NULL, year INT DEFAULT NULL, condition VARCHAR(20) NOT NULL, description TEXT NOT NULL, price NUMERIC(10, 2) NOT NULL, city VARCHAR(255) NOT NULL, state VARCHAR(255) NOT NULL, zip VARCHAR(255) NOT NULL, phone VARCHAR(255) NOT NULL, delivery BOOLEAN NOT NULL, features JSON NOT NULL, is_in_collection BOOLEAN NOT NULL, is_on_sale BOOLEAN NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_D34A04ADA23B42D ON product (manufacturer_id)');
        $this->addSql('ALTER TABLE image ADD CONSTRAINT FK_C53D045F4584665A FOREIGN KEY (product_id) REFERENCES product (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE product ADD CONSTRAINT FK_D34A04ADA23B42D FOREIGN KEY (manufacturer_id) REFERENCES manufacturer (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE image DROP CONSTRAINT FK_C53D045F4584665A');
        $this->addSql('ALTER TABLE product DROP CONSTRAINT FK_D34A04ADA23B42D');
        $this->addSql('DROP TABLE image');
        $this->addSql('DROP TABLE manufacturer');
        $this->addSql('DROP TABLE product');
    }
}
