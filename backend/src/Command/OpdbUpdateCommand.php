<?php

namespace App\Command;

use App\Service\OpdbService;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(name: 'opdb:update', description: 'Hello PhpStorm')]
class OpdbUpdateCommand extends Command
{
    public function __construct(
        private readonly OpdbService $opdbService
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        try {
            $this->opdbService->fetchAndSaveOpdbData();

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $output->writeln('Error: '.$e->getMessage());

            return Command::FAILURE;
        }
    }
}
