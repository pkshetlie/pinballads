<?php

declare(strict_types=1);

namespace App\Command;

use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(name: 'app:jwt:decode')]
class DecodeJwtCommand extends Command
{
    public function __construct(private JWTTokenManagerInterface $jwtManager)
    {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addArgument('token', InputArgument::REQUIRED, 'JWT token à décoder');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $token = $input->getArgument('token');
        $data = $this->jwtManager->parse($token);

        $output->writeln(json_encode($data, JSON_PRETTY_PRINT));
        return Command::SUCCESS;
    }
}
