<?php

namespace App\Dto\Opdb;

class ImageDto
{
    public function __construct(
        public readonly string $title,
        public readonly bool $primary,
        public readonly string $type,
        public readonly ImageUrlsDto $urls,
        public readonly ImageSizesDto $sizes,
    ) {}
}
