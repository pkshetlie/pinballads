<?php

namespace App\OpenApi;

use ApiPlatform\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\OpenApi\Model;
use ApiPlatform\OpenApi\OpenApi;

final class CustomOpenApiFactory implements OpenApiFactoryInterface
{
    public function __construct(private readonly OpenApiFactoryInterface $decorated)
    {
    }

    public function __invoke(array $context = []): OpenApi
    {
        $openApi = ($this->decorated)($context);
        $schemas = $openApi->getComponents()->getSchemas();
        $paths = $openApi->getPaths();

        /*
         * ======================================================
         * 🧱 Définition du schéma PinballDto
         * ======================================================
         */
        $schemas['PinballDto'] = new \ArrayObject([
            'type' => 'object',
            'properties' => [
                'id' => ['type' => 'integer', 'example' => 1],
                'name' => ['type' => 'string', 'example' => 'Addams Family'],
                'opdbId' => ['type' => 'string', 'example' => '1234abcd'],
                'features' => ['type' => 'array', 'items' => ['type' => 'string'], 'example' => ['Multiball', 'LED']],
                'description' => ['type' => 'string', 'example' => 'Flipper emblématique des années 90.'],
                'condition' => ['type' => 'string', 'example' => 'Excellent'],
                'images' => [
                    'type' => 'array',
                    'items' => [
                        'type' => 'object',
                        'properties' => [
                            'url' => ['type' => 'string', 'example' => 'https://example.com/uploads/pinballs/1.jpg'],
                            'title' => ['type' => 'string', 'example' => 'Vue avant'],
                            'uid' => ['type' => 'string', 'example' => 'img123']
                        ]
                    ]
                ],
                'year' => ['type' => 'integer', 'example' => 1992],
                'manufacturer' => ['type' => 'string', 'example' => 'Bally'],
                'currentOwnerId' => ['type' => 'integer', 'example' => 10],
                'collection' => ['type' => 'string', 'example' => 'Private Collection'],
                'currentOwner' => [
                    'type' => 'object',
                    'nullable' => true,
                    'properties' => [
                        'id' => ['type' => 'integer', 'example' => 12],
                        'username' => ['type' => 'string', 'example' => 'PinballFan']
                    ]
                ],
                'isForSale' => ['type' => 'boolean', 'example' => true],
                'price' => ['type' => 'number', 'example' => 2500],
                'priceHistory' => [
                    'type' => 'array',
                    'items' => [
                        'type' => 'object',
                        'properties' => [
                            'price' => ['type' => 'number', 'example' => 2200],
                            'date' => ['type' => 'string', 'format' => 'date', 'example' => '2024-01-01']
                        ]
                    ]
                ],
                'location' => [
                    'type' => 'object',
                    'properties' => [
                        'lat' => ['type' => 'number', 'example' => 48.8566],
                        'lon' => ['type' => 'number', 'example' => 2.3522]
                    ]
                ],
                'currency' => ['type' => 'string', 'example' => '€'],
                'owningDate' => ['type' => 'string', 'format' => 'date', 'example' => '2023-07-01'],
            ],
        ]);

        #region sales
        /*
         * ======================================================
         * 1️⃣ POST /api/public/sales
         * ======================================================
         */
        $paths->addPath('/api/public/sales', new Model\PathItem(
            ref: 'Recherche de ventes publiques',
            post: new Model\Operation(
                operationId: 'post_sales_list',
                tags: ['Sales'],
                summary: 'Recherche des flippers en vente publique',
                description: 'Retourne une liste paginée de flippers actuellement en vente, avec filtres optionnels (localisation, prix, etc.).',
                requestBody: new Model\RequestBody(
                    description: 'Filtres de recherche',
                    content: new \ArrayObject([
                        'application/json' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'location' => [
                                        'type' => 'object',
                                        'properties' => [
                                            'lon' => ['type' => 'number'],
                                            'lat' => ['type' => 'number'],
                                        ]
                                    ],
                                    'distance' => ['type' => 'number', 'example' => 10],
                                    'price' => [
                                        'type' => 'object',
                                        'properties' => [
                                            'min' => ['type' => 'number'],
                                            'max' => ['type' => 'number'],
                                            'currency' => ['type' => 'string', 'example' => 'EUR']
                                        ]
                                    ],
                                    'conditions' => ['type' => 'array', 'items' => ['type' => 'string']],
                                    'manufacturers' => ['type' => 'array', 'items' => ['type' => 'string']],
                                    'features' => ['type' => 'array', 'items' => ['type' => 'string']],
                                    'decades' => ['type' => 'array', 'items' => ['type' => 'string']],
                                ],
                            ],
                        ],
                    ])
                ),
                responses: [
                    '200' => [
                        'description' => 'Liste de flippers en vente',
                        'content' => [
                            'application/json' => [
                                'schema' => [
                                    'type' => 'object',
                                    'properties' => [
                                        'pinballs' => [
                                            'type' => 'array',
                                            'items' => ['$ref' => '#/components/schemas/PinballDto']
                                        ],
                                        'count' => ['type' => 'integer'],
                                        'total' => ['type' => 'integer'],
                                        'pages' => ['type' => 'integer'],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ]
            )
        ));

        /*
         * ======================================================
         * 2️⃣ GET /api/public/sales/machine/{id}
         * ======================================================
         */
        $paths->addPath('/api/public/sales/machine/{id}', new Model\PathItem(
            ref: 'Détail d’une vente publique',
            get: new Model\Operation(
                operationId: 'get_sales_machine',
                tags: ['Sales'],
                summary: 'Récupère les détails d’un flipper spécifique en vente',
                parameters: [
                    new Model\Parameter('id', 'path', 'Identifiant du flipper', required: true, schema: ['type' => 'integer']),
                ],
                responses: [
                    '200' => [
                        'description' => 'Flipper trouvé',
                        'content' => [
                            'application/json' => [
                                'schema' => ['$ref' => '#/components/schemas/PinballDto']
                            ],
                        ],
                    ],
                    '404' => ['description' => 'Aucune vente trouvée pour ce flipper'],
                ]
            )
        ));

        /*
         * ======================================================
         * 3️⃣ GET /api/public/featured
         * ======================================================
         */
        $paths->addPath('/api/public/featured', new Model\PathItem(
            ref: 'Flippers en vedette',
            get: new Model\Operation(
                operationId: 'get_featured_sales',
                tags: ['Sales'],
                summary: 'Liste de flippers mis en avant',
                parameters: [
                    new Model\Parameter('limit', 'query', 'Nombre maximum d’éléments à retourner', required: false, schema: ['type' => 'integer', 'default' => 4]),
                    new Model\Parameter('page', 'query', 'Page courante', required: false, schema: ['type' => 'integer', 'default' => 1]),
                ],
                responses: [
                    '200' => [
                        'description' => 'Liste des flippers en vedette',
                        'content' => [
                            'application/json' => [
                                'schema' => [
                                    'type' => 'object',
                                    'properties' => [
                                        'pinballs' => [
                                            'type' => 'array',
                                            'items' => ['$ref' => '#/components/schemas/PinballDto']
                                        ],
                                        'count' => ['type' => 'integer'],
                                        'total' => ['type' => 'integer'],
                                        'pages' => ['type' => 'integer'],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ]
            )
        ));
        #endregion


        return $openApi;
    }
}
