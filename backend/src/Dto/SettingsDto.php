<?php

namespace App\Dto;

use App\Entity\Message;
use App\Entity\User;
use App\Interface\DtoInterface;

class SettingsDto implements DtoInterface
{

    public string $language;
    public ?string $defaultSearchLocation;
    public ?int $defaultSearchDistance;
    public bool $isPublicProfile;
    public ?string $bio;
    public ?string $theme;
    public ?string $currency;
    public bool $isEmailNotificationAllowed;
    public bool $isEmailMessageNotificationAllowed;
    public bool $isEmailNewsletterNotificationAllowed;


    public function __construct(User $entity)
    {
       $this->language = $entity->getLanguage();
       $settings = $entity->getSettings();
       $this->defaultSearchLocation = $settings['defaultSearchLocation'] ?? null;
       $this->defaultSearchDistance = $settings['defaultSearchDistance'] ?? null;
       $this->isPublicProfile = (bool)($settings['isPublicProfile'] ?? false);
       $this->bio = $settings['bio'] ?? null;
       $this->theme = $settings['theme'] ?? null;
       $this->currency = $settings['currency'] ?? null;
       $this->isEmailNotificationAllowed = (bool)($settings['isEmailNotificationAllowed'] ?? false);
       $this->isEmailMessageNotificationAllowed = (bool)($settings['isEmailMessageNotificationAllowed'] ?? true);
       $this->isEmailNewsletterNotificationAllowed = (bool)($settings['isEmailNewsletterNotificationAllowed'] ?? false);

    }
}
