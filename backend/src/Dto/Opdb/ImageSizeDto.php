<?php

namespace App\Dto\Opdb;

class ImageSizeDto
{
    public function __construct(
        public readonly int $width,
        public readonly int $height,
    ) {}
}
