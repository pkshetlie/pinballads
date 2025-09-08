<?php

namespace App\Dto\Opdb;

class ImageUrlsDto
{
    public function __construct(
        public readonly string $small,
        public readonly string $medium,
        public readonly string $large,
    ) {}
}
