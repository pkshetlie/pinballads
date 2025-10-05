<?php

namespace App\Interface;

interface DtoInterface
{
    public static function fromEntity(DtoableInterface $entity): self;
}
