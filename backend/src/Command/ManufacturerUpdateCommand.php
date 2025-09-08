<?php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(name: 'app:mr', description: 'Hello PhpStorm')]
class ManufacturerUpdateCommand extends Command
{
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $token = '6v26No94NkPR8pSaqmOv5pdVL1EMszqCva1gIHR6gwAQbev9tWnpRUZGd90O';

        return Command::SUCCESS;
    }
}
