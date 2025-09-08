<?php

namespace App\Dto\Opdb;

class ImageSizesDto
{
    public function __construct(
        public readonly ImageSizeDto $small,
        public readonly ImageSizeDto $medium,
        public readonly ImageSizeDto $large,
    ) {}
}
