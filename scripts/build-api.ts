#!/usr/bin/env bun

import * as fs from 'fs/promises';
import * as ts from 'typescript';

// Type aliases for cleaner code
type InterfaceDeclaration = ts.InterfaceDeclaration;
type SourceFile = ts.SourceFile;
const { factory } = ts;

const printer = ts.createPrinter({
  newLine: ts.NewLineKind.LineFeed
});

interface OpenApiNode {
  type?: string;
  required?: string[];
  $ref?: string;
  items?: OpenApiNode;
  properties?: { [k: string]: OpenApiNode };
  format?: string;
}

interface OpenApiParam {
  name: string;
  description: string;
  in: string;
  required: boolean;
  schema: {
    type: string;
    format: string;
    items?: {
      type: string;
      format: string;
    };
  };
}

interface OpenApiResponse {
  ['200']: {
    description: string;
    content: {
      'application/json': {
        schema: {
          $ref?: string;
          type?: string;
          items?: {
            $ref: string;
          };
        };
      };
    };
    required: string[];
  };
}

interface OpenApiGet {
  description: string;
  parameters: OpenApiParam[];
  responses: OpenApiResponse;
}

interface OpenApiPost {
  description: string;
  responses: OpenApiResponse;
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: string;
        };
      };
    };
    required?: string[];
  };
}

interface OpenApiEndpoint {
  get?: OpenApiGet;
  post?: OpenApiPost;
}

interface OpenApiSpec {
  openapi: string;
  info: any;
  servers: any[];
  paths: { [k: string]: OpenApiEndpoint };
  components: {
    schemas: { [k: string]: OpenApiNode };
  };
}

const main = async () => {
  console.log('🚀 Starting API type generation...');

  // Load OpenAPI specification
  let openapi: any;
  try {
    const jsonContent = await fs.readFile('./scripts/cattedapi.json', 'utf-8');
    // Remove BOM if present (UTF-8 BOM is U+FEFF)
    const cleanContent = jsonContent.replace(/^\uFEFF/, '');
    openapi = JSON.parse(cleanContent);
  } catch (error) {
    console.error('❌ Failed to load OpenAPI specification:', error);
    process.exit(1);
  }

  const spec = openapi as OpenApiSpec;
  const schemas = spec.components.schemas;
  const paths = spec.paths;

  // Generate types.ts
  await generateTypesFile(schemas);

  // Generate endpoints.ts
  await generateEndpointsFile(paths, schemas);

  console.log('✅ API type generation completed successfully!');
};

function generateEventTypes(entityTypeNames: string[]): ts.TypeAliasDeclaration[] {
  // Create event type union for WebSocket events
  const eventTypeUnion = factory.createTypeAliasDeclaration(
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createIdentifier('EventType'),
    undefined,
    factory.createUnionTypeNode(
      entityTypeNames.map(entityName => {
        console.log(`🔍 Creating event type for entity: ${entityName}`);

        return factory.createTypeLiteralNode([
          factory.createPropertySignature(
            undefined,
            factory.createIdentifier('eventType'),
            undefined,
            factory.createUnionTypeNode([
              factory.createLiteralTypeNode(factory.createStringLiteral('Created')),
              factory.createLiteralTypeNode(factory.createStringLiteral('Updated')),
              factory.createLiteralTypeNode(factory.createStringLiteral('Deleted'))
            ])
          ),
          factory.createPropertySignature(
            undefined,
            factory.createIdentifier('entityType'),
            undefined,
            factory.createLiteralTypeNode(factory.createStringLiteral(entityName.toLowerCase()))
          ),
          factory.createPropertySignature(
            undefined,
            factory.createIdentifier('entity'),
            undefined,
            factory.createTypeReferenceNode(entityName)
          )
        ]);
      })
    )
  );

  return [eventTypeUnion];
}

async function generateTypesFile(schemas: { [k: string]: OpenApiNode }) {
  console.log('📝 Generating types.ts...');

  const resultFile = ts.createSourceFile(
    'api/types.ts',
    '',
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TSX
  );

  const entityTypes: InterfaceDeclaration[] = [];
  const requestTypes: InterfaceDeclaration[] = [];
  const responseTypes: InterfaceDeclaration[] = [];
  const entityTypeNames: string[] = [];

  // Process all schemas
  for (const [typeName, props] of Object.entries(schemas)) {
    if (typeName.includes('Request')) {
      requestTypes.push(createInterfaceDeclaration(typeName, props));
    } else if (typeName.includes('Response')) {
      responseTypes.push(createInterfaceDeclaration(typeName, props));
    } else {
      entityTypes.push(createInterfaceDeclaration(typeName, props));
      entityTypeNames.push(typeName);
    }
  }

  // Create union types
  const entityTypeUnion = factory.createTypeAliasDeclaration(
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createIdentifier('EntityType'),
    undefined,
    factory.createUnionTypeNode(entityTypes.map(et => factory.createTypeReferenceNode(et.name)))
  );

  const requestTypeUnion = factory.createTypeAliasDeclaration(
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createIdentifier('RequestType'),
    undefined,
    factory.createUnionTypeNode(requestTypes.map(rt => factory.createTypeReferenceNode(rt.name)))
  );

  const responseTypeUnion = factory.createTypeAliasDeclaration(
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createIdentifier('ResponseType'),
    undefined,
    factory.createUnionTypeNode(responseTypes.map(rt => factory.createTypeReferenceNode(rt.name)))
  );

  // Add header comment
  const headerComment = factory.createJSDocComment(
    'Generated Type Definitions from OpenAPI Spec\n\n' +
      'This file contains all the type definitions extracted from the OpenAPI specification.\n' +
      'Generated by build-api.ts - do not edit manually.'
  );

  // Add missing types that are imported by other files
  const missingTypes = [
    factory.createInterfaceDeclaration(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier('MdSubscription'),
      undefined,
      undefined,
      [
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('symbol'),
          undefined,
          factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
        ),
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('subscriptionId'),
          undefined,
          factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
        )
      ]
    ),

    // Market Data Request/Response Types

    // Quote subscription
    factory.createInterfaceDeclaration(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier('SubscribeQuoteRequest'),
      undefined,
      undefined,
      [
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('symbol'),
          undefined,
          factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
        )
      ]
    ),
    factory.createInterfaceDeclaration(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier('SubscribeQuoteResponse'),
      undefined,
      undefined,
      [
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('symbol'),
          undefined,
          factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
        ),
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('subscriptionId'),
          undefined,
          factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
        )
      ]
    ),
    factory.createInterfaceDeclaration(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier('UnsubscribeQuoteRequest'),
      undefined,
      undefined,
      [
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('symbol'),
          undefined,
          factory.createUnionTypeNode([
            factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
            factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
          ])
        )
      ]
    ),
    factory.createInterfaceDeclaration(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier('UnsubscribeQuoteResponse'),
      undefined,
      undefined,
      [
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('symbol'),
          undefined,
          factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
        ),
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('subscriptionId'),
          undefined,
          factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
        )
      ]
    ),

    // DOM subscription
    factory.createInterfaceDeclaration(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier('SubscribeDOMRequest'),
      undefined,
      undefined,
      [
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('symbol'),
          undefined,
          factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
        ),
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('depth'),
          factory.createToken(ts.SyntaxKind.QuestionToken),
          factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
        )
      ]
    ),
    factory.createInterfaceDeclaration(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier('SubscribeDOMResponse'),
      undefined,
      undefined,
      [
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('symbol'),
          undefined,
          factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
        ),
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('subscriptionId'),
          undefined,
          factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
        )
      ]
    ),
    factory.createInterfaceDeclaration(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier('UnsubscribeDOMRequest'),
      undefined,
      undefined,
      [
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('symbol'),
          undefined,
          factory.createUnionTypeNode([
            factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
            factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
          ])
        )
      ]
    ),
    factory.createInterfaceDeclaration(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier('UnsubscribeDOMResponse'),
      undefined,
      undefined,
      [
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('symbol'),
          undefined,
          factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
        ),
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('subscriptionId'),
          undefined,
          factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
        )
      ]
    ),

    // Histogram subscription
    factory.createInterfaceDeclaration(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier('SubscribeHistogramRequest'),
      undefined,
      undefined,
      [
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('symbol'),
          undefined,
          factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
        ),
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('interval'),
          factory.createToken(ts.SyntaxKind.QuestionToken),
          factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
        ),
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('lookbackPeriod'),
          factory.createToken(ts.SyntaxKind.QuestionToken),
          factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
        )
      ]
    ),
    factory.createInterfaceDeclaration(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier('SubscribeHistogramResponse'),
      undefined,
      undefined,
      [
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('symbol'),
          undefined,
          factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
        ),
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('subscriptionId'),
          undefined,
          factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
        )
      ]
    ),
    factory.createInterfaceDeclaration(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier('UnsubscribeHistogramRequest'),
      undefined,
      undefined,
      [
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('symbol'),
          undefined,
          factory.createUnionTypeNode([
            factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
            factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
          ])
        )
      ]
    ),
    factory.createInterfaceDeclaration(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier('UnsubscribeHistogramResponse'),
      undefined,
      undefined,
      [
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('symbol'),
          undefined,
          factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
        ),
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('subscriptionId'),
          undefined,
          factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
        )
      ]
    ),

    // Chart subscription
    factory.createInterfaceDeclaration(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier('ChartDescription'),
      undefined,
      undefined,
      [
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('underlyingType'),
          undefined,
          factory.createUnionTypeNode([
            factory.createLiteralTypeNode(factory.createStringLiteral('MinuteBar')),
            factory.createLiteralTypeNode(factory.createStringLiteral('DailyBar')),
            factory.createLiteralTypeNode(factory.createStringLiteral('WeeklyBar')),
            factory.createLiteralTypeNode(factory.createStringLiteral('MonthlyBar')),
            factory.createLiteralTypeNode(factory.createStringLiteral('YearlyBar')),
            factory.createLiteralTypeNode(factory.createStringLiteral('CandleStick')),
            factory.createLiteralTypeNode(factory.createStringLiteral('Tick')),
            factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
          ])
        ),
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('elementSize'),
          undefined,
          factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
        ),
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('withHistogram'),
          factory.createToken(ts.SyntaxKind.QuestionToken),
          factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword)
        )
      ]
    ),
    factory.createInterfaceDeclaration(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier('TimeRange'),
      undefined,
      undefined,
      [
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('asMuchAsElements'),
          factory.createToken(ts.SyntaxKind.QuestionToken),
          factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
        ),
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('closestTimestamp'),
          factory.createToken(ts.SyntaxKind.QuestionToken),
          factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
        ),
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('closestTickId'),
          factory.createToken(ts.SyntaxKind.QuestionToken),
          factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
        )
      ]
    ),
    factory.createInterfaceDeclaration(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier('GetChartRequest'),
      undefined,
      undefined,
      [
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('symbol'),
          undefined,
          factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
        ),
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('chartDescription'),
          undefined,
          factory.createTypeReferenceNode('ChartDescription')
        ),
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('timeRange'),
          undefined,
          factory.createTypeReferenceNode('TimeRange')
        )
      ]
    ),
    factory.createInterfaceDeclaration(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier('GetChartResponse'),
      undefined,
      undefined,
      [
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('subscriptionId'),
          undefined,
          factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
        ),
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('realtimeId'),
          undefined,
          factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
        ),
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('historicalId'),
          undefined,
          factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
        ),
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('symbol'),
          undefined,
          factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
        ),
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('charts'),
          factory.createToken(ts.SyntaxKind.QuestionToken),
          factory.createArrayTypeNode(factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword))
        )
      ]
    ),
    factory.createInterfaceDeclaration(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier('CancelChartRequest'),
      undefined,
      undefined,
      [
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('subscriptionId'),
          undefined,
          factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
        )
      ]
    ),
    factory.createInterfaceDeclaration(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier('CancelChartResponse'),
      undefined,
      undefined,
      [
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('subscriptionId'),
          undefined,
          factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
        )
      ]
    )
  ];

  // Generate EventType union for WebSocket events
  const eventTypes = generateEventTypes(entityTypeNames);

  const allNodes: readonly ts.Statement[] = [
    entityTypeUnion,
    requestTypeUnion,
    responseTypeUnion,
    ...entityTypes,
    ...requestTypes,
    ...responseTypes,
    ...missingTypes,
    ...eventTypes
  ];

  await writeFile(resultFile, allNodes, 'api/types.ts');
}

async function generateEndpointsFile(
  paths: { [k: string]: OpenApiEndpoint },
  schemas: { [k: string]: OpenApiNode }
) {
  console.log('🔗 Generating endpoints.ts...');

  const resultFile = ts.createSourceFile(
    'api/endpoints.ts',
    '',
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TSX
  );

  const endpoints: ts.TypeLiteralNode[] = [];
  const urlInMap: { [k: string]: string } = {};
  const urlOutMap: { [k: string]: string } = {};
  const requestTypesReferenced: Set<string> = new Set();

  // Process all paths
  for (const [endpoint, definition] of Object.entries(paths)) {
    const cleanEndpoint = endpoint.slice(1); // Remove leading slash

    if (definition.get) {
      // GET endpoint
      const endpointType = createGetEndpointType(cleanEndpoint, definition.get, schemas);
      endpoints.push(endpointType);

      // Update URL maps
      const responseType = getResponseType(definition.get);
      urlInMap[cleanEndpoint] = responseType;
      urlOutMap[cleanEndpoint] = 'GetRequest'; // Type for GET requests
    } else if (definition.post) {
      // POST endpoint
      const endpointType = createPostEndpointType(
        cleanEndpoint,
        definition.post,
        schemas,
        requestTypesReferenced
      );
      endpoints.push(endpointType);

      // Update URL maps
      const responseType = getResponseType(definition.post);
      urlInMap[cleanEndpoint] = responseType;
      urlOutMap[cleanEndpoint] = 'PostRequest'; // Type for POST requests
    }
  }

  // Add missing market data endpoints (WebSocket-specific)
  const mdEndpoints = [
    'md/subscribeQuote',
    'md/unsubscribeQuote',
    'md/subscribeDOM',
    'md/unsubscribeDOM',
    'md/subscribeHistogram',
    'md/unsubscribeHistogram',
    'md/getChart',
    'md/cancelChart'
  ];

  // Add market data endpoints (WebSocket-specific)
  for (const mdEndpoint of mdEndpoints) {
    const endpointType = factory.createTypeLiteralNode([
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('url'),
        undefined,
        factory.createLiteralTypeNode(factory.createStringLiteral(mdEndpoint))
      ),
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('request'),
        undefined,
        factory.createTypeLiteralNode([
          factory.createPropertySignature(
            undefined,
            factory.createIdentifier('body'),
            undefined,
            factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
          )
        ])
      ),
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('response'),
        undefined,
        factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
      )
    ]);

    endpoints.push(endpointType);
    urlInMap[mdEndpoint] = 'any';
    urlOutMap[mdEndpoint] = 'PostRequest';
  }

  // Add WebSocket-only endpoints to the main Endpoint union
  const wsOnlyEndpoints = ['authorize'];

  // Create WebSocket-specific endpoint types and add them to the main endpoints array
  for (const wsEndpoint of wsOnlyEndpoints) {
    if (wsEndpoint === 'authorize') {
      // authorize endpoint has a special request structure - accepts either string or { body: string }
      const endpointType = factory.createTypeLiteralNode([
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('url'),
          undefined,
          factory.createLiteralTypeNode(factory.createStringLiteral(wsEndpoint))
        ),
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('request'),
          undefined,
          factory.createUnionTypeNode([
            factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
            factory.createTypeLiteralNode([
              factory.createPropertySignature(
                undefined,
                factory.createIdentifier('body'),
                undefined,
                factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
              )
            ])
          ])
        ),
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('response'),
          undefined,
          factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
        )
      ]);

      endpoints.push(endpointType);
      urlInMap[wsEndpoint] = 'any';
      urlOutMap[wsEndpoint] = 'PostRequest';
    } else {
      // Default structure for other WebSocket-only endpoints
      const endpointType = factory.createTypeLiteralNode([
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('url'),
          undefined,
          factory.createLiteralTypeNode(factory.createStringLiteral(wsEndpoint))
        ),
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('request'),
          undefined,
          factory.createTypeLiteralNode([
            factory.createPropertySignature(
              undefined,
              factory.createIdentifier('body'),
              undefined,
              factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
            )
          ])
        ),
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('response'),
          undefined,
          factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
        )
      ]);

      endpoints.push(endpointType);
      urlInMap[wsEndpoint] = 'any';
      urlOutMap[wsEndpoint] = 'PostRequest';
    }
  }

  // Create the main Endpoint discriminated union (now includes all endpoints)
  const endpointUnion = factory.createTypeAliasDeclaration(
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createIdentifier('Endpoint'),
    undefined,
    factory.createUnionTypeNode(endpoints)
  );

  // Create URL mapping types
  const urlInMapType = createUrlMapType('UrlInMap', urlInMap);
  const urlOutMapType = createUrlMapType('UrlOutMap', urlOutMap);

  // Create GetRequest and PostRequest types
  const getRequestType = factory.createTypeAliasDeclaration(
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createIdentifier('GetRequest'),
    undefined,
    factory.createTypeLiteralNode([
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('body'),
        factory.createToken(ts.SyntaxKind.QuestionToken), // Make optional
        factory.createTypeLiteralNode([])
      )
    ])
  );

  const postRequestType = factory.createTypeAliasDeclaration(
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createIdentifier('PostRequest'),
    undefined,
    factory.createTypeLiteralNode([
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('body'),
        factory.createToken(ts.SyntaxKind.QuestionToken), // Make optional
        factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
      )
    ])
  );

  // Create utility types
  const utilityTypes = createUtilityTypes();

  // Add header comment
  const headerComment = factory.createJSDocComment(
    'Generated Endpoint Types from OpenAPI Spec\n\n' +
      'This file contains the discriminated union of all API endpoints.\n' +
      'Generated by build-api.ts - do not edit manually.'
  );

  // Create import statement for all types (both response types and request types)
  const allTypesToImport = [
    ...Object.values(urlInMap)
      .filter(type => type !== 'any')
      .map(getBaseTypeName), // Response types (base names)
    ...Array.from(requestTypesReferenced) // Request types
  ];

  const uniqueTypes = allTypesToImport.filter((type, index, arr) => arr.indexOf(type) === index);

  const importStatement = factory.createImportDeclaration(
    undefined,
    factory.createImportClause(
      false,
      undefined,
      factory.createNamedImports(
        uniqueTypes.map(type =>
          factory.createImportSpecifier(
            true, // isTypeOnly = true to indicate these are type imports
            undefined,
            factory.createIdentifier(type as string)
          )
        )
      )
    ),
    factory.createStringLiteral('./types')
  );

  const allNodes: readonly ts.Statement[] = [
    importStatement,
    endpointUnion,
    urlInMapType,
    urlOutMapType,
    getRequestType,
    postRequestType,
    ...utilityTypes
  ];

  await writeFile(resultFile, allNodes, 'api/endpoints.ts');
}

function createGetEndpointType(
  endpoint: string,
  definition: OpenApiGet,
  schemas: { [k: string]: OpenApiNode }
) {
  const requestType = createGetRequestType(endpoint, definition);
  const responseType = getResponseType(definition);

  return factory.createTypeLiteralNode([
    factory.createPropertySignature(
      undefined,
      factory.createIdentifier('url'),
      undefined,
      factory.createLiteralTypeNode(factory.createStringLiteral(endpoint))
    ),
    factory.createPropertySignature(
      undefined,
      factory.createIdentifier('request'),
      undefined,
      requestType
    ),
    factory.createPropertySignature(
      undefined,
      factory.createIdentifier('response'),
      undefined,
      factory.createTypeReferenceNode(responseType)
    )
  ]);
}

function createPostEndpointType(
  endpoint: string,
  definition: OpenApiPost,
  schemas: { [k: string]: OpenApiNode },
  requestTypesReferenced: Set<string>
) {
  const requestType = createPostRequestType(endpoint, definition, schemas, requestTypesReferenced);
  const responseType = getResponseType(definition);

  return factory.createTypeLiteralNode([
    factory.createPropertySignature(
      undefined,
      factory.createIdentifier('url'),
      undefined,
      factory.createLiteralTypeNode(factory.createStringLiteral(endpoint))
    ),
    factory.createPropertySignature(
      undefined,
      factory.createIdentifier('request'),
      undefined,
      requestType
    ),
    factory.createPropertySignature(
      undefined,
      factory.createIdentifier('response'),
      undefined,
      factory.createTypeReferenceNode(responseType)
    )
  ]);
}

function createGetRequestType(endpoint: string, definition: OpenApiGet) {
  if (definition.parameters && definition.parameters.length > 0) {
    // Has query parameters
    return factory.createTypeLiteralNode([
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('body'),
        factory.createToken(ts.SyntaxKind.QuestionToken), // Make optional
        factory.createTypeLiteralNode([]) // Empty body for GET
      ),
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('query'),
        undefined,
        factory.createTypeLiteralNode(
          definition.parameters.map(param =>
            factory.createPropertySignature(
              undefined,
              factory.createIdentifier(param.name),
              param.required ? undefined : factory.createToken(ts.SyntaxKind.QuestionToken),
              convertParamType(param)
            )
          )
        )
      )
    ]);
  } else {
    // No parameters - make body optional since it's empty
    return factory.createTypeLiteralNode([
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('body'),
        factory.createToken(ts.SyntaxKind.QuestionToken), // Make optional
        factory.createTypeLiteralNode([]) // Empty body
      )
    ]);
  }
}

function createPostRequestType(
  endpoint: string,
  definition: OpenApiPost,
  schemas: { [k: string]: OpenApiNode },
  requestTypesReferenced: Set<string>
) {
  const requestBodyRef = definition.requestBody?.content?.['application/json']?.schema?.$ref;

  if (requestBodyRef) {
    const typeName = requestBodyRef.split('/').pop()!;
    requestTypesReferenced.add(typeName);
    return factory.createTypeLiteralNode([
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('body'),
        undefined, // Required when there's actual body data
        factory.createTypeReferenceNode(typeName)
      )
    ]);
  } else {
    // No request body - make body optional since it's empty
    return factory.createTypeLiteralNode([
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('body'),
        factory.createToken(ts.SyntaxKind.QuestionToken), // Make optional
        factory.createTypeLiteralNode([]) // Empty body
      )
    ]);
  }
}

function getResponseType(definition: OpenApiGet | OpenApiPost): string {
  const responseSchema = definition.responses['200']?.content?.['application/json']?.schema;

  if (responseSchema?.type === 'array' && (responseSchema as any).items?.$ref) {
    // Handle array of reference types
    const typeName = (responseSchema as any).items.$ref.split('/').pop()!;
    console.log(`🔍 Found array of $ref: ${(responseSchema as any).items.$ref} -> ${typeName}[]`);
    return `${typeName}[]`;
  } else if (responseSchema?.type === 'array' && (responseSchema as any).items?.type) {
    // Handle array of primitive types
    const itemType = (responseSchema as any).items.type;
    console.log(`🔍 Found array of primitive type: ${itemType}[]`);
    return `${itemType}[]`;
  } else if (responseSchema?.$ref) {
    // Handle single reference type
    const typeName = responseSchema.$ref.split('/').pop()!;
    console.log(`🔍 Found $ref: ${responseSchema.$ref} -> ${typeName}`);
    return typeName;
  } else if (responseSchema?.type) {
    // Handle primitive types
    console.log(`🔍 Found primitive type: ${responseSchema.type}`);
    return responseSchema.type;
  } else {
    // If we can't determine the type, log it for debugging
    console.warn('⚠️  Could not determine response type for endpoint');
    console.log('🔍 Response schema:', JSON.stringify(responseSchema, null, 2));
    return 'any';
  }
}

function getBaseTypeName(typeString: string): string {
  // Extract base type name from array types (e.g., "Account[]" -> "Account")
  if (typeString.endsWith('[]')) {
    return typeString.slice(0, -2);
  }
  return typeString;
}

function createUrlMapType(name: string, urlMap: { [k: string]: string }) {
  const members = Object.entries(urlMap).map(([url, type]) =>
    factory.createPropertySignature(
      undefined, // modifiers
      factory.createStringLiteral(url), // name
      undefined, // questionToken
      factory.createTypeReferenceNode(type) // type
    )
  );

  return factory.createInterfaceDeclaration(
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createIdentifier(name),
    undefined,
    undefined,
    members
  );
}

function createUtilityTypes() {
  return [
    // EndpointUrl type
    factory.createTypeAliasDeclaration(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier('EndpointUrl'),
      undefined,
      factory.createTypeReferenceNode("Endpoint['url']")
    ),

    // RequestForUrl type
    factory.createTypeAliasDeclaration(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier('RequestForUrl'),
      [
        factory.createTypeParameterDeclaration(
          undefined,
          factory.createIdentifier('T'),
          undefined,
          undefined
        )
      ],
      factory.createTypeReferenceNode("Extract<Endpoint, { url: T }>['request']")
    ),

    // ResponseForUrl type
    factory.createTypeAliasDeclaration(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier('ResponseForUrl'),
      [
        factory.createTypeParameterDeclaration(
          undefined,
          factory.createIdentifier('T'),
          undefined,
          undefined
        )
      ],
      factory.createTypeReferenceNode("Extract<Endpoint, { url: T }>['response']")
    ),

    // EndpointForUrl type
    factory.createTypeAliasDeclaration(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier('EndpointForUrl'),
      [
        factory.createTypeParameterDeclaration(
          undefined,
          factory.createIdentifier('T'),
          undefined,
          undefined
        )
      ],
      factory.createTypeReferenceNode('Extract<Endpoint, { url: T }>')
    )
  ];
}

function createInterfaceDeclaration(name: string, props: OpenApiNode): InterfaceDeclaration {
  const properties = Object.entries(props.properties || {}).map(([key, value]) => {
    const isRequired = props.required?.includes(key) || key === 'id';

    return factory.createPropertySignature(
      undefined,
      factory.createIdentifier(key),
      isRequired ? undefined : factory.createToken(ts.SyntaxKind.QuestionToken),
      convertType(value)
    );
  });

  return factory.createInterfaceDeclaration(
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createIdentifier(name),
    undefined,
    undefined,
    properties
  );
}

function convertType(value: OpenApiNode): ts.TypeNode {
  if (value.$ref) {
    const typeName = value.$ref.split('/').pop()!;
    return factory.createTypeReferenceNode(typeName);
  }

  switch (value.type) {
    case 'string':
      return factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
    case 'integer':
    case 'number':
      return factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
    case 'boolean':
      return factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
    case 'array':
      if (value.items) {
        return factory.createArrayTypeNode(convertType(value.items));
      }
      return factory.createArrayTypeNode(factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword));
    case 'object':
      if (value.properties) {
        return factory.createTypeLiteralNode(
          Object.entries(value.properties).map(([key, prop]) =>
            factory.createPropertySignature(
              undefined,
              factory.createIdentifier(key),
              undefined,
              convertType(prop)
            )
          )
        );
      }
      return factory.createKeywordTypeNode(ts.SyntaxKind.ObjectKeyword);
    default:
      return factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
  }
}

function convertParamType(param: OpenApiParam): ts.TypeNode {
  switch (param.schema.type) {
    case 'string':
      return factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
    case 'integer':
    case 'number':
      return factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
    case 'boolean':
      return factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
    case 'array':
      if (param.schema.items) {
        return factory.createArrayTypeNode(
          factory.createKeywordTypeNode(
            param.schema.items.type === 'string'
              ? ts.SyntaxKind.StringKeyword
              : param.schema.items.type === 'number' || param.schema.items.type === 'integer'
                ? ts.SyntaxKind.NumberKeyword
                : param.schema.items.type === 'boolean'
                  ? ts.SyntaxKind.BooleanKeyword
                  : ts.SyntaxKind.AnyKeyword
          )
        );
      }
      return factory.createArrayTypeNode(factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword));
    default:
      return factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
  }
}

async function writeFile(sourceFile: SourceFile, nodes: readonly ts.Statement[], filename: string) {
  const updatedFile = factory.updateSourceFile(sourceFile, factory.createNodeArray(nodes));

  const content = printer.printFile(updatedFile);
  await fs.writeFile(filename, content);
  console.log(`✅ Generated ${filename} with ${nodes.length} nodes`);
}

// Run the generator
main().catch(error => {
  console.error('❌ API generation failed:', error);
  process.exit(1);
});
