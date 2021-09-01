export const marketTypes = [
  {
    kind: "Struct",
    name: "Header",
    description: "Market Data message header.",
    fields: [
      {
        name: "length",
        type: "MsgLength",
        description: "Message length.",
      },
      {
        name: "version",
        type: "MsgVersion",
        description:
          "Indicates the version of the Market Data protocol in which the message is defined.",
      },
      {
        name: "msgType",
        type: "MsgType",
        description: "Type of the message (e.g. OrderExecute).",
      },
      {
        name: "seqNum",
        type: "SeqNum",
        description:
          "Sequence number of the message added by the Market Data Sequencer.",
      },
      {
        name: "timestamp",
        type: "Timestamp",
        description: "Timestamp indicating when the message was sequenced.",
      },
      {
        name: "sourceTimestamp",
        type: "Timestamp",
        description: "Timestamp added by the service which sent the message.",
      },
    ],
  },
  {
    kind: "Struct",
    name: "ReplayRequest",
    description: "Message replay request.",
    fields: [
      {
        name: "seqNum",
        type: "SeqNum",
        description: "Initial sequence number for the requested range.",
      },
      {
        name: "endSeqNum",
        type: "SeqNum",
        description: "Final sequence number for the requested range.",
      },
    ],
  },
  {
    kind: "Struct",
    name: "BusinessClassificationMethod",
    description: "Defines a business classification method.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "businessClassificationMethodId",
        type: "BusinessClassificationMethodId",
        description: "Business classification method ID.",
      },
      {
        name: "businessClassificationMethodName",
        type: "BusinessClassificationMethodName",
        description: "Business classification method name.",
      },
    ],
  },
  {
    kind: "Struct",
    name: "BusinessClassificationTree",
    description: "List of defined business classifications.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "businessClassificationTreeId",
        type: "BusinessClassificationTreeId",
        description: "ID of the business classification.",
      },
      {
        name: "businessClassificationTreeParentId",
        type: "BusinessClassificationTreeId",
        description:
          "ID of the parent business classification (if the given classification is a sub-classification).\r\nWhen there's no parent business classification, the value is set to 0.",
      },
      {
        name: "businessClassificationTreeName",
        type: "BusinessClassificationTreeName",
        description: "Name of the business classification.",
      },
      {
        name: "businessClassificationTreeCode",
        type: "BusinessClassificationTreeCode",
        description: "Code of the business classification.",
      },
      {
        name: "businessClassificationMethodId",
        type: "BusinessClassificationMethodId",
        description: "Business classification method ID.",
      },
    ],
  },
  {
    kind: "Struct",
    name: "Calendar",
    description: "Message containing a trading calendar.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "calendarId",
        type: "CalendarId",
        description: "ID of the trading calendar.",
      },
      {
        name: "calendarName",
        type: "CalendarName",
        description: "Name of the trading calendar.",
      },
    ],
  },
  {
    kind: "Struct",
    name: "CalendarException",
    description: "Message containing a calendar exception.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "calendarExceptionId",
        type: "CalendarExceptionId",
        description: "Calendar exception ID.",
      },
      {
        name: "calendarExceptionDate",
        type: "Date",
        description: "Calendar exception date.",
      },
      {
        name: "calendarExceptionComment",
        type: "CalendarExceptionComment",
        description: "Calendar exception comment.",
      },
      {
        name: "calendarExceptionRecurrent",
        type: "CalendarExceptionRecurrent",
        description:
          "Indicates whether a calendar exception is recurring or not.",
      },
      {
        name: "calendarExceptionType",
        type: "CalendarExceptionType",
        description: "Calendar exception type ID.",
      },
      {
        name: "calendarId",
        type: "CalendarId",
        description: "Calendar ID.",
      },
    ],
  },
  {
    kind: "Struct",
    name: "CollarTable",
    description: "Message describing a collar table.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "collarTableId",
        type: "CollarTableId",
        description: "Collar table ID.",
      },
      {
        name: "collarTableName",
        type: "CollarTableName",
        description: "Collar table name.",
      },
      {
        name: "collarModeId",
        type: "CollarMode",
        description: "Collar mode (trade price collar or order price collar).",
      },
    ],
  },
  {
    kind: "Struct",
    name: "Country",
    description: "List of defined countries.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "countryId",
        type: "CountryId",
        description: "Two-letter country code.",
      },
      {
        name: "countryCode",
        type: "CountryCode",
        description: "Three-letter country code.",
      },
      {
        name: "countryName",
        type: "CountryName",
        description: 'Country name, for example "Poland".',
      },
    ],
  },
  {
    kind: "Struct",
    name: "Currency",
    description: "List of defined currencies.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "currencyId",
        type: "CurrencyId",
        description: "Three-letter ID of a given currency (e.g. USD).",
      },
      {
        name: "currencyName",
        type: "CurrencyName",
        description: 'Name of the currency, for example "Pound sterling".',
      },
      {
        name: "currencyPrecision",
        type: "Precision",
      },
    ],
  },
  {
    kind: "Struct",
    name: "FinancialProductBond",
    description: "List of defined products.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "productId",
        type: "ProductId",
        description: "ID of the product.",
      },
      {
        name: "productIdentification",
        type: "ProductIdentification",
        description: "Product identification, for example its ISIN number.",
      },
      {
        name: "productName",
        type: "ProductName",
        description: "Name of the product.",
      },
      {
        name: "productIdentificationTypeId",
        type: "ProductIdentificationTypeId",
        description:
          "ID of the product identification type (for example ISIN or SEDOL).",
      },
      {
        name: "productUnderlyingId",
        type: "ProductUnderlyingId",
        description: "ID of underlying.\r\n",
      },
      {
        name: "financialProductIssuerId",
        type: "FinancialProductIssuerId",
        description: "ID of the product's issuer.",
      },
      {
        name: "financialProductCfi",
        type: "CfiCode",
        description: "Product's CFI code as specified in ISO 18774.",
      },
      {
        name: "financialProductFisn",
        type: "FisnCode",
        description: "Product's FISN code as specified in ISO 10962.",
      },
      {
        name: "nominalValueType",
        type: "NominalValueType",
        description:
          "Type of the product's nominal value (no nominal, constant or unknown).",
      },
      {
        name: "financialProductNominalValue",
        type: "ProductNominalValue",
        description: "Nominal value of the product.",
      },
      {
        name: "issueSizeType",
        type: "IssueSizeType",
        description:
          "ID of the product's issue size type (quantity, value or no issue size).",
      },
      {
        name: "financialProductIssueSize",
        type: "ProductIssueSize",
        description: "Issue size of the product.",
      },
      {
        name: "nominalCurrencyId",
        type: "CurrencyId",
        description:
          "Currency in which the product is denominated (three-letter code).",
      },
      {
        name: "mifirIdentifier",
        type: "MifirIdentifier",
      },
      {
        name: "liquidityFlag",
        type: "LiquidityFlag",
      },
      {
        name: "financialProductBondExpiryDate",
        type: "Date",
        description: "Date on which the bond expires.",
      },
      {
        name: "financialProductBondCouponFrequency",
        type: "FinancialProductBondCouponFrequency",
      },
      {
        name: "seniorityBond",
        type: "SeniorityBond",
        description: "The bond's seniority.",
      },
      {
        name: "couponType",
        type: "CouponType",
      },
    ],
  },
  {
    kind: "Struct",
    name: "FinancialProductClassification",
    description: "Message defining a financial product classification.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "financialProductClassificationId",
        type: "FinancialProductClassificationId",
        description: "ID of the financial product classification.",
      },
      {
        name: "financialProductClassificationTreeId",
        type: "FinancialProductClassificationTreeId",
        description: "ID of the financial product classification tree.",
      },
      {
        name: "productId",
        type: "ProductId",
        description: "ID of the product.",
      },
    ],
  },
  {
    kind: "Struct",
    name: "FinancialProductClassificationMethod",
    description: "Message defining a financial product classification method.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "financialProductClassificationMethodId",
        type: "FinancialProductClassificationMethodId",
        description: "ID of the financial product classification method.",
      },
      {
        name: "financialProductClassificationMethodName",
        type: "FinancialProductClassificationMethodName",
        description: "Name of the financial product classification method.",
      },
    ],
  },
  {
    kind: "Struct",
    name: "FinancialProductClassificationTree",
    description: "List of defined product types.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "financialProductClassificationTreeId",
        type: "FinancialProductClassificationTreeId",
        description: "ID of the product type.",
      },
      {
        name: "financialProductClassificationTreeName",
        type: "FinancialProductClassificationTreeName",
        description: "Name of the product type.",
      },
      {
        name: "financialProductClassificationTreeParentId",
        type: "FinancialProductClassificationTreeId",
        description: "ID of the parent product.",
      },
      {
        name: "financialProductClassificationTreeCode",
        type: "FinancialProductClassificationTreeCode",
        description:
          "ID of the parent product type (if the current type is a sub-type).\r\nWhen there's no parent product type, the value is set to 0.",
      },
      {
        name: "financialProductClassificationMethodId",
        type: "FinancialProductClassificationMethodId",
        description: "Code of the product type.",
      },
    ],
  },
  {
    kind: "Struct",
    name: "FinancialProductIssuer",
    description: "Collection of defined issuers of financial products.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "financialProductIssuerId",
        type: "FinancialProductIssuerId",
        description: "Identifier of an issuer.",
      },
      {
        name: "financialProductIssuerName",
        type: "FinancialProductIssuerName",
        description: "Name of an issuer.",
      },
      {
        name: "financialProductIssuerLei",
        type: "LeiCode",
        description:
          "Issuer's Legal Entity Identifier as specified in ISO 17422.",
      },
      {
        name: "financialProductIssuerBic",
        type: "BicCode",
        description:
          "Issuer's Business Identification Code as specified in ISO 9362.",
      },
      {
        name: "registrationCountryId",
        type: "CountryId",
        description:
          "Country of the registration (two-letter country code) of the issuer.",
      },
      {
        name: "mainActivityCountryId",
        type: "CountryId",
        description:
          "Country of the main activity (two-letter country code) of the issuer.",
      },
    ],
  },
  {
    kind: "Struct",
    name: "FinancialProductIssuerBusinessClassification",
    description: "Business classification for issuer.\r\n",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "financialProductIssuerBusinessClassificationId",
        type: "FinancialProductIssuerBusinessClassificationId",
        description: "Unique key for classification of the issuer.",
      },
      {
        name: "businessClassificationTreeId",
        type: "BusinessClassificationTreeId",
        description: "Business classification key.",
      },
      {
        name: "financialProductIssuerId",
        type: "FinancialProductIssuerId",
        description: "Issuer key.",
      },
    ],
  },
  {
    kind: "Struct",
    name: "FinancialProductShare",
    description: "List of defined products.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "productId",
        type: "ProductId",
        description: "ID of the product.",
      },
      {
        name: "productIdentification",
        type: "ProductIdentification",
        description: "Product identification, for example its ISIN number.",
      },
      {
        name: "productName",
        type: "ProductName",
        description: "Name of the product.",
      },
      {
        name: "productIdentificationTypeId",
        type: "ProductIdentificationTypeId",
        description:
          "ID of the product identification type (for example ISIN or SEDOL).",
      },
      {
        name: "productUnderlyingId",
        type: "ProductId",
        description: "ID of the underlying product.",
      },
      {
        name: "financialProductIssuerId",
        type: "FinancialProductIssuerId",
        description: "ID of the product's issuer.",
      },
      {
        name: "financialProductCfi",
        type: "CfiCode",
        description: "Product's CFI code as specified in ISO 18774.",
      },
      {
        name: "financialProductFisn",
        type: "FisnCode",
        description: "Product's FISN code as specified in ISO 10962.",
      },
      {
        name: "nominalValueType",
        type: "NominalValueType",
        description:
          "Type of the product's nominal value (no nominal, constant or unknown).",
      },
      {
        name: "financialProductNominalValue",
        type: "ProductNominalValue",
        description: "Nominal value of the product.",
      },
      {
        name: "issueSizeType",
        type: "IssueSizeType",
        description:
          "ID of the product's issue size type (quantity, value or no issue size).",
      },
      {
        name: "financialProductIssueSize",
        type: "ProductIssueSize",
        description: "Issue size of the product.",
      },
      {
        name: "nominalCurrencyId",
        type: "CurrencyId",
        description:
          "Currency in which the product is denominated (three-letter code).",
      },
      {
        name: "usIndicator",
        type: "UsIndicator",
        description: "US Regulation S indicator.",
      },
    ],
  },
  {
    kind: "Struct",
    name: "Heartbeat",
    description: "A message type used to check connectivity.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
    ],
  },
  {
    kind: "Struct",
    name: "MarketOperator",
    description: "List of defined market operators.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "marketOperatorId",
        type: "MarketOperatorId",
        description: "ID of the market operator.",
      },
      {
        name: "marketOperatorOperatingMIC",
        type: "MicCode",
        description:
          "Market operator's Market Identifier Code (MIC) as specified in ISO 10383.",
      },
      {
        name: "marketOperatorName",
        type: "MarketOperatorName",
        description: "Name of the market operator.",
      },
      {
        name: "marketOperatorLei",
        type: "LeiCode",
        description:
          "Market operator's Legal Entity Identifier as specified in ISO 17422.",
      },
      {
        name: "marketOperatorBIC",
        type: "BicCode",
        description: "BIC of the market operator.",
      },
      {
        name: "countryId",
        type: "CountryId",
        description:
          "Market operator's country of registration (two-letter country code).",
      },
    ],
  },
  {
    kind: "Struct",
    name: "MarketSegment",
    description: "List of defined market segments.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "marketSegmentId",
        type: "MarketSegmentId",
        description: "ID of the market segment.",
      },
      {
        name: "marketSegmentParentId",
        type: "MarketSegmentId",
        description:
          "ID of the parent market segment.\r\nWhen there's no parent market segment, the value is set to 0.",
      },
      {
        name: "marketSegmentName",
        type: "MarketSegmentName",
        description: "Market segment name.",
      },
      {
        name: "marketSegmentMic",
        type: "MicCode",
        description:
          "Market segment's Market Identifier Code (MIC) as specified in ISO 10383.",
      },
      {
        name: "marketSegmentBboDepth",
        type: "BboDepth",
        description:
          "Number of price levels published for a given market segment.",
      },
      {
        name: "marketSegmentTypeId",
        type: "MarketSegmentTypeId",
        description: "ID of the market segment type.",
      },
      {
        name: "tradingVenueId",
        type: "TradingVenueId",
        description: "ID of the trading venue.",
      },
    ],
  },
  {
    kind: "Struct",
    name: "MarketSegmentPriceLevelConfig",
    description:
      "Message used to configure the depth of price level snapshots published by OMD BBO.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "marketSegmentId",
        type: "MarketSegmentId",
        description: "ID of the market segment being configured.",
      },
      {
        name: "snapshotDepth",
        type: "SnapshotDepth",
        description:
          "Number of price levels to be published for a given market segment, max=10.",
      },
    ],
  },
  {
    kind: "Struct",
    name: "MarketSegmentType",
    description: "List of defined market segment types.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "marketSegmentTypeId",
        type: "MarketSegmentTypeId",
        description: "ID of the market segment type.",
      },
      {
        name: "marketSegmentTypeName",
        type: "MarketSegmentTypeName",
        description: "Name of the type of market segment.",
      },
    ],
  },
  {
    kind: "Struct",
    name: "OrderAdd",
    description: "Message used to add new orders to the system.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "orderId",
        type: "OrderId",
        description: "ID of the order being added.",
      },
      {
        name: "tradableProductId",
        type: "TradableProductId",
        description: "ID of the tradable product in the order being added.",
      },
      {
        name: "side",
        type: "OrderSide",
        description: "Side (buy/sell) of the order being added.",
      },
      {
        name: "price",
        type: "Price",
        description: "Price of the order being added.",
      },
      {
        name: "quantity",
        type: "Quantity",
        description: "Quantity of the order being added.",
      },
    ],
  },
  {
    kind: "Struct",
    name: "OrderCollarTableEntry",
    description:
      "Message containing an entry into the collars table for orders.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "collarTableId",
        type: "CollarTableId",
        description: "Collar table ID.",
      },
      {
        name: "collarExpression",
        type: "CollarExpression",
        description: "Collar expression type.",
      },
      {
        name: "collarLowerBound",
        type: "CollarBound",
        description: "Collar lower bound.",
      },
      {
        name: "collarLowerBid",
        type: "CollarBound",
        description: "Lower collar for bids.",
      },
      {
        name: "collarLowerAsk",
        type: "CollarBound",
        description: "Lower collar for asks.",
      },
      {
        name: "collarUpperBid",
        type: "CollarBound",
        description: "Upper collar for bids.",
      },
      {
        name: "collarUpperAsk",
        type: "CollarBound",
        description: "Upper collar for asks.",
      },
    ],
  },
  {
    kind: "Struct",
    name: "OrderDelete",
    description: "Message used to delete existing orders.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "orderId",
        type: "OrderId",
        description: "ID of the order being deleted.",
      },
    ],
  },
  {
    kind: "Struct",
    name: "OrderExecute",
    description: "A message informing about order execution.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "tradableProductId",
        type: "TradableProductId",
        description: "ID of the underlying tradable product.",
      },
      {
        name: "orderId",
        type: "OrderId",
        description: "ID of the underlying order.",
      },
      {
        name: "quantity",
        type: "Quantity",
        description: "Quantity remaining on the market.",
      },
      {
        name: "executionId",
        type: "TradeId",
        description: "ID of the underlying trade.",
      },
      {
        name: "executionPrice",
        type: "Price",
        description: "Price at which the order was executed.",
      },
      {
        name: "executionQuantity",
        type: "Quantity",
        description: "Execution quantity.",
      },
    ],
  },
  {
    kind: "Struct",
    name: "OrderModify",
    description: "Message used to modify existing orders.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "orderId",
        type: "OrderId",
        description: "ID of the order being modified.",
      },
      {
        name: "price",
        type: "Price",
        description: "Order price after modification.",
      },
      {
        name: "quantity",
        type: "Quantity",
        description: "Order quantity after modification.",
      },
      {
        name: "priorityFlag",
        type: "PriorityFlag",
        description:
          "Indicates whether the priority flag is lost or retained after modification.",
      },
    ],
  },
  {
    kind: "Struct",
    name: "PriceLevelUpdate",
    description: "Market Data message used to transmit price levels.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "tradableProductId",
        type: "TradableProductId",
        description: "Product to which the price level refers.",
      },
      {
        name: "priceLevelNumber",
        type: "PriceLevelNumber",
        description:
          "Number of the price level, where 1 is the highest (best price).",
      },
      {
        name: "priceLevel",
        type: "Price",
        description: "Price level in currency units.",
      },
      {
        name: "priceLevelQty",
        type: "Quantity",
        description: "Quantity of securities available at a given price level.",
      },
      {
        name: "priceLevelSide",
        type: "OrderSide",
        description: "Price level side (buy or sell).",
      },
      {
        name: "orderCount",
        type: "OrderCount",
        description: "Number of open orders at a given price level.",
      },
    ],
  },
  {
    kind: "Struct",
    name: "ProductIdentificationType",
    description: "List of defined product identification types.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "productIdentificationTypeId",
        type: "ProductIdentificationTypeId",
        description: "ID of the product identification type.",
      },
      {
        name: "productIdentificationTypeName",
        type: "ProductIdentificationTypeName",
        description:
          "Name of the product identification type (for example ISIN).",
      },
    ],
  },
  {
    kind: "Struct",
    name: "Test",
    description: "A message used to test system operation.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "timestampA",
        type: "Timestamp",
        description: "First Core Bus timestamp.",
      },
      {
        name: "timestampB",
        type: "Timestamp",
        description: "Sequencer timestamp.",
      },
      {
        name: "timestampC",
        type: "Timestamp",
        description: "Market Data timestamp.",
      },
      {
        name: "timestampD",
        type: "Timestamp",
        description: "Consumer timestamp.",
      },
    ],
  },
  {
    kind: "Struct",
    name: "TestMax",
    description: "A test message of the maximum size supported by the system.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "payload",
        type: "TestPayload",
        description:
          "The largest UDP packet the system can work with. The length is 1500 minus message header size (36 b) minus IP and UDP header sizes (28 b) = 1436.",
      },
    ],
  },
  {
    kind: "Struct",
    name: "Text",
    description: "A text message.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "text",
        type: "TextMessage",
        description: "Arbitrary text.",
      },
    ],
  },
  {
    kind: "Struct",
    name: "TickTable",
    fields: [
      {
        name: "header",
        type: "Header",
      },
      {
        name: "tickTableId",
        type: "TickTableId",
      },
      {
        name: "tickTableName",
        type: "TickTableName",
      },
      {
        name: "tickTableDescription",
        type: "TickTableDescription",
      },
      {
        name: "tickTableType",
        type: "TickTableType",
      },
    ],
  },
  {
    kind: "Struct",
    name: "TickTableEntry",
    description: "Message defining tick size.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "tickTableEntryId",
        type: "TickTableEntryId",
        description: "Tick size ID.",
      },
      {
        name: "tickTableEntryTickSize",
        type: "TickTableEntryTickSize",
        description: "A single tick.",
      },
      {
        name: "tickTableEntryLowerBound",
        type: "TickTableEntryLowerBound",
        description: "Tick size lower bound.",
      },
      {
        name: "tickTableId",
        type: "TickTableId",
        description: "Tick table ID.",
      },
    ],
  },
  {
    kind: "Struct",
    name: "TradableProduct",
    description: "List of defined tradable products.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "tradableProductId",
        type: "TradableProductId",
        description: "ID of the tradable product.",
      },
      {
        name: "tradableProductName",
        type: "TradableProductName",
        description: "Name of the tradable product.",
      },
      {
        name: "tradableProductFirstTradingDate",
        type: "Date",
        description: "First trading date of the tradable product.",
      },
      {
        name: "tradableProductLastTradingDate",
        type: "Date",
        description: "Last trading date of the tradable product.",
      },
      {
        name: "tradableProductLotSize",
        type: "LotSize",
        description: "Lot size for the tradable product.",
      },
      {
        name: "tradableProductMinimumIcebergValue",
        type: "TradableProductMinimumIcebergValue",
        description:
          "Minimum value for iceberg orders for the tradable product.",
      },
      {
        name: "productId",
        type: "ProductId",
        description: "ID of the product.",
      },
      {
        name: "tradingGroupId",
        type: "TradingGroupId",
        description: "ID of the trading group.",
      },
      {
        name: "tradingCurrencyId",
        type: "CurrencyId",
        description: "Three-letter ID of the trading currency (e.g. USD).",
      },
      {
        name: "priceExpressionType",
        type: "PriceExpressionType",
        description: "Price expression type for the tradable product.",
      },
      {
        name: "marketSegmentId",
        type: "MarketSegmentId",
        description: "ID of the tradable product's market segment.",
      },
      {
        name: "calendarId",
        type: "CalendarId",
        description:
          "ID of the trading calendar used for the tradable product.",
      },
      {
        name: "tickTableId",
        type: "TickTableId",
        description: "ID of the tick table used for the tradable product.",
      },
      {
        name: "preTradeCheckMaxVolume",
        type: "PreTradeCheckMaxVolume",
        description:
          "Max volume for pre-trade checks for the tradable product.",
      },
      {
        name: "preTradeCheckMaxValue",
        type: "PreTradeCheckMaxValue",
        description: "Max value for pre-trade checks for the tradable product.",
      },
      {
        name: "preTradeCheckMinValue",
        type: "PreTradeCheckMinValue",
        description: "Min value for pre-trade checks for the tradable product.",
      },
      {
        name: "preTradeCheckMinVolume",
        type: "PreTradeCheckMinVolume",
        description:
          "Min volume for pre-trade checks for the tradable product.",
      },
      {
        name: "maxVolumeType",
        type: "VolumeType",
        description: "How max volume is expressed for the tradable product.",
      },
      {
        name: "minVolumeType",
        type: "VolumeType",
        description: "How min volume is expressed for the tradable product.",
      },
      {
        name: "settlementCalendarId",
        type: "SettlementCalendarId",
      },
      {
        name: "bboDepth",
        type: "BboDepth",
      },
      {
        name: "accruedInterestPrecision",
        type: "Precision",
      },
      {
        name: "valuePrecision",
        type: "Precision",
      },
    ],
  },
  {
    kind: "Struct",
    name: "TradeCollarTableEntry",
    description:
      "Message containing an entry into the collars table for trades.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "collarTableId",
        type: "CollarTableId",
        description: "Collar table ID.",
      },
      {
        name: "collarExpression",
        type: "CollarExpression",
        description: "Collar expression type.",
      },
      {
        name: "collarLowerBound",
        type: "CollarBound",
        description: "Collar lower bound.",
      },
      {
        name: "collarValue",
        type: "CollarValue",
        description: "Collar value.",
      },
    ],
  },
  {
    kind: "Struct",
    name: "TradingConfig",
    description: "List of defined trading configurations.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "tradingConfigId",
        type: "TradingConfigId",
        description: "ID of the trading configuration.",
      },
      {
        name: "tradingConfigName",
        type: "TradingConfigName",
        description: "Name of the trading configuration.",
      },
    ],
  },
  {
    kind: "Struct",
    name: "TradingGroup",
    description: "List of defined trading groups.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "tradingGroupId",
        type: "TradingGroupId",
        description: "ID of the trading group.",
      },
      {
        name: "marketSegmentId",
        type: "MarketSegmentId",
        description: "ID of the market segment.",
      },
      {
        name: "tradingGroupName",
        type: "TradingGroupName",
        description: "Name of the trading group.",
      },
    ],
  },
  {
    kind: "Struct",
    name: "TradingVenue",
    description: "List of defined trading venues.",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "tradingVenueId",
        type: "TradingVenueId",
        description: "ID of the trading venue.",
      },
      {
        name: "tradingVenueMic",
        type: "MicCode",
        description:
          "Trading venue's Market Identifier Code (MIC) as specified in ISO 10383.",
      },
      {
        name: "tradingVenueName",
        type: "TradingVenueName",
        description: "Name of the trading venue.",
      },
      {
        name: "marketOperatorId",
        type: "MarketOperatorId",
        description: "ID of the market operator.",
      },
    ],
  },
  {
    kind: "Struct",
    name: "WeekPlan",
    description: "Message containing a week plan (trading schedule).",
    fields: [
      {
        name: "header",
        type: "Header",
        description: "Message header.",
      },
      {
        name: "weekPlanId",
        type: "WeekPlanId",
        description: "Week plan ID.",
      },
      {
        name: "dayOfWeek",
        type: "DayOfWeek",
        description: "Day of week.",
      },
      {
        name: "dayStatus",
        type: "DayStatus",
        description: "Day status.",
      },
      {
        name: "calendarId",
        type: "CalendarId",
        description: "Calendar ID.",
      },
    ],
  },
  {
    kind: "Enum",
    name: "MsgType",
    underlying: "u16",
    variants: [
      ["Heartbeat", 1, "A message type used to check connectivity."],
      ["Text", 2, "A text message."],
      ["Test", 3, "A message used to test system operation."],
      [
        "TestMax",
        8,
        "A test message of the maximum size supported by the system.",
      ],
      ["OrderAdd", 9, "Message used to add new orders to the system."],
      ["OrderModify", 10, "Message used to modify existing orders."],
      ["OrderDelete", 11, "Message used to delete existing orders."],
      ["OrderExecute", 12, "A message informing about order execution."],
      [
        "BusinessClassificationTree",
        13,
        "List of defined business classifications.",
      ],
      ["Country", 14, "List of defined countries."],
      [
        "FinancialProductIssuer",
        15,
        "Collection of defined issuers of financial products.",
      ],
      ["MarketOperator", 16, "List of defined market operators."],
      ["TradingVenue", 17, "List of defined trading venues."],
      ["MarketSegmentType", 18, "List of defined market segment types."],
      ["TradingConfig", 19, "List of defined trading configurations."],
      ["MarketSegment", 20, "List of defined market segments."],
      [
        "FinancialProductClassificationTree",
        21,
        "List of defined product types.",
      ],
      ["TradingGroup", 22, "List of defined trading groups."],
      ["FinancialProductShare", 23, "List of defined products."],
      [
        "ProductIdentificationType",
        24,
        "List of defined product identification types.",
      ],
      ["Currency", 25, "List of defined currencies."],
      ["TradableProduct", 26, "List of defined tradable products."],
      [
        "BusinessClassificationMethod",
        27,
        "Defines a business classification method.",
      ],
      [
        "FinancialProductIssuerBusinessClassification",
        28,
        "Business classification for issuer.\r\n",
      ],
      ["FinancialProductBond", 29, "List of defined products."],
      [
        "FinancialProductClassificationMethod",
        30,
        "Message defining a financial product classification method.",
      ],
      [
        "FinancialProductClassification",
        31,
        "Message defining a financial product classification.",
      ],
      ["TickTableEntry", 32, "Message defining tick size."],
      ["TickTable", 33],
      ["Calendar", 34, "Message containing a trading calendar."],
      ["CalendarException", 35, "Message containing a calendar exception."],
      [
        "PriceLevelUpdate",
        256,
        "Market Data message used to transmit price levels.",
      ],
      [
        "MarketSegmentPriceLevelConfig",
        258,
        "Message used to configure the depth of price level snapshots published by OMD BBO.",
      ],
      ["CollarTable", 259, "Message describing a collar table."],
      [
        "OrderCollarTableEntry",
        260,
        "Message containing an entry into the collars table for orders.",
      ],
      [
        "TradeCollarTableEntry",
        261,
        "Message containing an entry into the collars table for trades.",
      ],
      ["WeekPlan", 666, "Message containing a week plan (trading schedule)."],
    ],
  },
  {
    kind: "Union",
    name: "Message",
    members: [
      "Heartbeat",
      "Text",
      "Test",
      "TestMax",
      "OrderAdd",
      "OrderModify",
      "OrderDelete",
      "OrderExecute",
      "BusinessClassificationTree",
      "Country",
      "FinancialProductIssuer",
      "MarketOperator",
      "TradingVenue",
      "MarketSegmentType",
      "TradingConfig",
      "MarketSegment",
      "FinancialProductClassificationTree",
      "TradingGroup",
      "FinancialProductShare",
      "ProductIdentificationType",
      "Currency",
      "TradableProduct",
      "BusinessClassificationMethod",
      "FinancialProductIssuerBusinessClassification",
      "FinancialProductBond",
      "FinancialProductClassificationMethod",
      "FinancialProductClassification",
      "TickTableEntry",
      "TickTable",
      "Calendar",
      "CalendarException",
      "PriceLevelUpdate",
      "MarketSegmentPriceLevelConfig",
      "CollarTable",
      "OrderCollarTableEntry",
      "TradeCollarTableEntry",
      "WeekPlan",
    ],
    discriminator: ["header", "msgType"],
  },
];

export const sharedTypes = [
  {
    kind: "Primitive",
    name: "bool",
    size: 1,
    description: "Boolean",
  },
  {
    kind: "Primitive",
    name: "u8",
    size: 1,
    description: "Unsigned integer, 8-bit.",
  },
  {
    kind: "Primitive",
    name: "u16",
    size: 2,
    description: "Unsigned integer, 16-bit.",
  },
  {
    kind: "Primitive",
    name: "u32",
    size: 4,
    description: "Unsigned integer, 32-bit.",
  },
  {
    kind: "Primitive",
    name: "f64",
    size: 8,
    description:
      "A 64-bit floating point type (specifically, the “binary64” type defined in IEEE 754-2008).",
  },
  {
    kind: "Primitive",
    name: "i64",
    size: 8,
    description: "Signed integer, 64-bit.",
  },
  {
    kind: "Primitive",
    name: "u64",
    size: 8,
    description: "Unsigned integer, 64-bit.",
  },
  {
    kind: "Alias",
    name: "AnsiChar",
    alias: "u8",
    description: "String.",
  },
  {
    kind: "Alias",
    name: "BusinessClassificationMethodId",
    alias: "u32",
    description: "ID of the business classification.",
  },
  {
    kind: "Alias",
    name: "BusinessClassificationTreeId",
    alias: "u32",
    description: "ID of the business classification.",
  },
  {
    kind: "Alias",
    name: "CalendarExceptionId",
    alias: "u32",
    description: "Calendar exception ID.",
  },
  {
    kind: "Alias",
    name: "CalendarExceptionRecurrent",
    alias: "bool",
    description: "Indicates whether a calendar exception is recurring or not.",
  },
  {
    kind: "Alias",
    name: "CalendarId",
    alias: "u32",
    description: "ID of a trading calendar.",
  },
  {
    kind: "Alias",
    name: "CcpId",
    alias: "u32",
    description: "ID of a CCP.",
  },
  {
    kind: "Alias",
    name: "ClientId",
    alias: "u16",
    description: "ID of the client.",
  },
  {
    kind: "Alias",
    name: "ClientOrderId",
    alias: "u32",
    description: "ID of the client order.",
  },
  {
    kind: "Alias",
    name: "CollarBound",
    alias: "Number",
    description: "Collar bound.",
  },
  {
    kind: "Alias",
    name: "CollarLogicId",
    alias: "u32",
  },
  {
    kind: "Alias",
    name: "CollarTableId",
    alias: "u32",
    description: "Collar table ID.",
  },
  {
    kind: "Alias",
    name: "CollarValue",
    alias: "Number",
    description: "Collar value.",
  },
  {
    kind: "Alias",
    name: "ConnectionId",
    alias: "u16",
    description: "ID of the connection.",
  },
  {
    kind: "Alias",
    name: "CouponPeriodBasePointSpread",
    alias: "Number",
  },
  {
    kind: "Alias",
    name: "CouponPeriodEndDate",
    alias: "Date",
  },
  {
    kind: "Alias",
    name: "CouponPeriodExDivStartDate",
    alias: "Date",
  },
  {
    kind: "Alias",
    name: "CouponPeriodFixedRate",
    alias: "Number",
  },
  {
    kind: "Alias",
    name: "CouponPeriodId",
    alias: "u32",
    description: "Coupon period ID.",
  },
  {
    kind: "Alias",
    name: "CouponPeriodPaymentDate",
    alias: "Date",
  },
  {
    kind: "Alias",
    name: "CouponPeriodStartDate",
    alias: "Date",
  },
  {
    kind: "Alias",
    name: "Date",
    alias: "u32",
    description:
      "Date (YYYYMMDD) as integer value. In case of undefined date value of '0' (zero) is used.",
  },
  {
    kind: "Alias",
    name: "FinancialProductBondBasePointSpread",
    alias: "Number",
    description: "Bond spread in base points.",
  },
  {
    kind: "Alias",
    name: "FinancialProductBondCouponFrequency",
    alias: "u32",
  },
  {
    kind: "Alias",
    name: "FinancialProductBondFixedRate",
    alias: "Number",
    description: "Bond fixed rate.",
  },
  {
    kind: "Alias",
    name: "FinancialProductClassificationId",
    alias: "u32",
    description: "Financial product classification ID.",
  },
  {
    kind: "Alias",
    name: "FinancialProductClassificationMethodId",
    alias: "u32",
    description: "Financial product classification method ID.",
  },
  {
    kind: "Alias",
    name: "FinancialProductClassificationTreeId",
    alias: "u32",
    description: "Financial product classification tree ID.",
  },
  {
    kind: "Alias",
    name: "FinancialProductIssuerBusinessClassificationId",
    alias: "u32",
    description: "Financial product issuer business classification ID.",
  },
  {
    kind: "Alias",
    name: "FinancialProductIssuerId",
    alias: "u32",
    description: "Identifier of an issuer.",
  },
  {
    kind: "Alias",
    name: "IndexationTableEntryId",
    alias: "u32",
    description: "Indexation table entry ID.",
  },
  {
    kind: "Alias",
    name: "IndexationTableEntryValue",
    alias: "Number",
    description: "Indexation table entry value.",
  },
  {
    kind: "Alias",
    name: "IndexationTableId",
    alias: "u32",
    description: "Indexation table ID.",
  },
  {
    kind: "Alias",
    name: "LotSize",
    alias: "u32",
    description: "Lot size.",
  },
  {
    kind: "Alias",
    name: "MarketOperatorId",
    alias: "u32",
    description: "ID of the market operator.",
  },
  {
    kind: "Alias",
    name: "MarketSegmentId",
    alias: "u32",
    description: "ID of the market segment.",
  },
  {
    kind: "Alias",
    name: "MarketSegmentPriceLevelPublished",
    alias: "u8",
    description: "Number of price levels published for a given market segment.",
  },
  {
    kind: "Alias",
    name: "MarketSegmentTypeId",
    alias: "u32",
    description: "ID of the market segment type.",
  },
  {
    kind: "Alias",
    name: "MifidFlags",
    alias: "u8",
    description:
      "Mifid related flags, bitfield:\r\n<ul>\r\n\t<li>0x1 = LiquidityProvisionActivity;</li>\r\n\t<li>0x2 = DirectOrSponsoredAccess;</li>\r\n\t<li>0x4 = AlgorithmicTrade.</li>\r\n<li>0x8 = MarketMakerOrSpecialist;</li></ul>",
  },
  {
    kind: "Alias",
    name: "MsgLength",
    alias: "u16",
    description: "Length of the message.",
  },
  {
    kind: "Alias",
    name: "MsgVersion",
    alias: "u16",
    description:
      "Message version - used to differentiate between messages sent using different versions of the protocol.",
  },
  {
    kind: "Alias",
    name: "Number",
    alias: "i64",
    description: "Number.",
  },
  {
    kind: "Alias",
    name: "OrderCount",
    alias: "u16",
    description: "Order count (number of orders).",
  },
  {
    kind: "Alias",
    name: "OrderId",
    alias: "u64",
    description: "ID of a given order.",
  },
  {
    kind: "Alias",
    name: "OwnerId",
    alias: "u32",
    description: "Settlement calendar owner ID.",
  },
  {
    kind: "Alias",
    name: "ParticipantId",
    alias: "u32",
    description: "Participant ID.",
  },
  {
    kind: "Alias",
    name: "ParticipantTypeId",
    alias: "u32",
    description: "Participant type ID.",
  },
  {
    kind: "Alias",
    name: "Port",
    alias: "u16",
    description: "Port number.",
  },
  {
    kind: "Alias",
    name: "Precision",
    alias: "u8",
  },
  {
    kind: "Alias",
    name: "PreTradeCheckMaxValue",
    alias: "Number",
    description: "Max value for pre-trade check.",
  },
  {
    kind: "Alias",
    name: "PreTradeCheckMaxVolume",
    alias: "Number",
    description: "Max volume for pre-trade check.",
  },
  {
    kind: "Alias",
    name: "PreTradeCheckMinValue",
    alias: "Number",
    description: "Min value for pre-trade check.",
  },
  {
    kind: "Alias",
    name: "PreTradeCheckMinVolume",
    alias: "Number",
    description: "Min volume for pre-trade check.",
  },
  {
    kind: "Alias",
    name: "Price",
    alias: "Number",
    description: "Price of the product.",
  },
  {
    kind: "Alias",
    name: "PriceLevelNumber",
    alias: "u16",
    description: "Ordinal number of the price level, where 1 is the best.",
  },
  {
    kind: "Alias",
    name: "PriceLevelsPublished",
    alias: "u16",
  },
  {
    kind: "Alias",
    name: "ProductId",
    alias: "u32",
    description: "ID of the product.",
  },
  {
    kind: "Alias",
    name: "ProductIdentificationTypeId",
    alias: "u32",
    description:
      "ID of the product identification type (for example ISIN or SEDOL).",
  },
  {
    kind: "Alias",
    name: "ProductIssueSize",
    alias: "u64",
    description: "Issue size of the product.",
  },
  {
    kind: "Alias",
    name: "ProductNominalValue",
    alias: "Number",
    description: "Nominal value of the product.",
  },
  {
    kind: "Alias",
    name: "ProductTypeId",
    alias: "u32",
    description: "ID of the product type.",
  },
  {
    kind: "Alias",
    name: "ProductUnderlyingId",
    alias: "u32",
    description: "Identifier of the underlying product.",
  },
  {
    kind: "Alias",
    name: "Quantity",
    alias: "u64",
    description: "Quantity of a tradable product.",
  },
  {
    kind: "Alias",
    name: "RandomStopTimeMinus",
    alias: "u32",
    description: "Random stop time for minus, value in seconds.",
  },
  {
    kind: "Alias",
    name: "RandomStopTimePlus",
    alias: "u32",
    description: "Random stop time for plus,  value in seconds.",
  },
  {
    kind: "Alias",
    name: "ReferencePriceLogicId",
    alias: "u32",
  },
  {
    kind: "Alias",
    name: "ReferencePriceSetId",
    alias: "u32",
  },
  {
    kind: "Alias",
    name: "SeqNum",
    alias: "u32",
    description: "Sequence number of the message.",
  },
  {
    kind: "Alias",
    name: "ServiceId",
    alias: "u16",
    description: "ID of the service (system component).",
  },
  {
    kind: "Alias",
    name: "SessionId",
    alias: "u16",
    description: "ID of the session.",
  },
  {
    kind: "Alias",
    name: "SettlementCalendarId",
    alias: "u32",
    description: "Settlement calendar ID.",
  },
  {
    kind: "Alias",
    name: "SettlementCycle",
    alias: "u16",
    description: "Settlement cycle for block transactions.",
  },
  {
    kind: "Alias",
    name: "SettlementDayId",
    alias: "u32",
    description: "Settlement day ID.",
  },
  {
    kind: "Alias",
    name: "ShortCode",
    alias: "u32",
    description: "Short code (participant identifier).",
  },
  {
    kind: "Alias",
    name: "SnapshotDepth",
    alias: "u8",
  },
  {
    kind: "Alias",
    name: "TickTableEntryId",
    alias: "u32",
    description: "Tick size ID.",
  },
  {
    kind: "Alias",
    name: "TickTableEntryLowerBound",
    alias: "Number",
    description: "Tick size lower bound.",
  },
  {
    kind: "Alias",
    name: "TickTableEntryTickSize",
    alias: "Number",
    description: "A single tick.",
  },
  {
    kind: "Alias",
    name: "TickTableId",
    alias: "u32",
    description: "Tick table ID.",
  },
  {
    kind: "Alias",
    name: "Timestamp",
    alias: "u64",
    description: "Timestamp (exact date and time of an event).",
  },
  {
    kind: "Alias",
    name: "TradableProductId",
    alias: "u32",
    description: "ID of the tradable product.",
  },
  {
    kind: "Alias",
    name: "TradableProductMinimumIcebergValue",
    alias: "Number",
    description: "Minimum iceberg order value for a tradable product.",
  },
  {
    kind: "Alias",
    name: "TradeId",
    alias: "u32",
    description: "ID of the trade (match between buy and sell orders).",
  },
  {
    kind: "Alias",
    name: "TradingConfigId",
    alias: "u32",
    description: "ID of the trading configuration.",
  },
  {
    kind: "Alias",
    name: "TradingGroupId",
    alias: "u32",
    description: "ID of the trading group.",
  },
  {
    kind: "Alias",
    name: "TradingPhaseAuctionDuration",
    alias: "u32",
    description: "Duration of an auction trading phase.",
  },
  {
    kind: "Alias",
    name: "TradingPhaseId",
    alias: "u32",
    description: "Trading phase ID.",
  },
  {
    kind: "Alias",
    name: "TradingPhaseMaxUnhaltCount",
    alias: "u8",
    description: "Maximum number of unhalts allowed for a trading phase.",
  },
  {
    kind: "Alias",
    name: "TradingPhaseStartTime",
    alias: "Timestamp",
  },
  {
    kind: "Alias",
    name: "TradingPhaseStopTime",
    alias: "Timestamp",
  },
  {
    kind: "Alias",
    name: "TradingPhaseSuspensionDuration",
    alias: "u32",
    description: "Duration of a suspension trading phase.",
  },
  {
    kind: "Alias",
    name: "TradingPortId",
    alias: "u16",
    description: "Trading port ID.",
  },
  {
    kind: "Alias",
    name: "TradingScheduleId",
    alias: "u32",
    description: "Trading schedule ID.",
  },
  {
    kind: "Alias",
    name: "TradingVenueId",
    alias: "u32",
    description: "ID of the trading venue.",
  },
  {
    kind: "Alias",
    name: "UnscheduledAuctionId",
    alias: "u32",
    description: "Unscheduled auction trading phase ID.",
  },
  {
    kind: "Alias",
    name: "WeekPlanId",
    alias: "u32",
    description: "Week plan ID.",
  },
  {
    kind: "Alias",
    name: "AccruedInterestTableEntryId",
    alias: "u32",
    description: "Accrued interest table entry ID.",
  },
  {
    kind: "Alias",
    name: "AccruedInterestTableEntryValue",
    alias: "Number",
    description: "Accrued interest table entry value.",
  },
  {
    kind: "Alias",
    name: "AccruedInterestTableId",
    alias: "u32",
    description: "Accrued interest table ID.",
  },
  {
    kind: "Array",
    name: "Account",
    type: "AnsiChar",
    length: 16,
    description: "Account mnemonic as agreed between buy and sell sides.",
  },
  {
    kind: "Alias",
    name: "BboDepth",
    alias: "u8",
    description: "Number of price levels published for a given market segment.",
  },
  {
    kind: "Array",
    name: "BicCode",
    type: "AnsiChar",
    length: 8,
    description: "Business Identification Code as specified in ISO 9362.",
  },
  {
    kind: "Array",
    name: "BusinessClassificationMethodName",
    type: "AnsiChar",
    length: 50,
    description: "Name of the business classification.",
  },
  {
    kind: "Array",
    name: "BusinessClassificationTreeCode",
    type: "AnsiChar",
    length: 10,
    description: "Code of the business classification.",
  },
  {
    kind: "Array",
    name: "BusinessClassificationTreeName",
    type: "AnsiChar",
    length: 50,
    description: "Name of the business classification.",
  },
  {
    kind: "Array",
    name: "CalendarExceptionComment",
    type: "AnsiChar",
    length: 50,
    description: "Calendar exception comment.",
  },
  {
    kind: "Array",
    name: "CalendarName",
    type: "AnsiChar",
    length: 50,
    description: "Name of a trading calendar.",
  },
  {
    kind: "Array",
    name: "CfiCode",
    type: "AnsiChar",
    length: 6,
    description:
      "Clarification of Financial Instruments as specified in ISO 18774.",
  },
  {
    kind: "Array",
    name: "ClearingCode",
    type: "AnsiChar",
    length: 50,
    description: "Code used for clearing.",
  },
  {
    kind: "Array",
    name: "CollarLogicDescription",
    type: "AnsiChar",
    length: 50,
  },
  {
    kind: "Array",
    name: "CollarLogicName",
    type: "AnsiChar",
    length: 50,
  },
  {
    kind: "Array",
    name: "CollarTableDescription",
    type: "AnsiChar",
    length: 50,
    description: "Collar table description.",
  },
  {
    kind: "Array",
    name: "CollarTableName",
    type: "AnsiChar",
    length: 50,
    description: "Collar table name.",
  },
  {
    kind: "Array",
    name: "CompId",
    type: "AnsiChar",
    length: 16,
    description: "Company ID.",
  },
  {
    kind: "Array",
    name: "CountryCode",
    type: "AnsiChar",
    length: 3,
    description: "Three-letter country code.",
  },
  {
    kind: "Array",
    name: "CountryId",
    type: "AnsiChar",
    length: 2,
    description: 'Short country code, for example "PL".',
  },
  {
    kind: "Array",
    name: "CountryName",
    type: "AnsiChar",
    length: 50,
    description: 'Country name, for example "Poland".',
  },
  {
    kind: "Array",
    name: "CurrencyId",
    type: "AnsiChar",
    length: 3,
    description: "Three-letter ID of a given currency (e.g. USD).",
  },
  {
    kind: "Array",
    name: "CurrencyName",
    type: "AnsiChar",
    length: 50,
    description: 'Name of the currency, for example "Pound sterling".',
  },
  {
    kind: "Array",
    name: "FinancialProductClassificationMethodName",
    type: "AnsiChar",
    length: 50,
    description: "Name of a financial product classification method.",
  },
  {
    kind: "Array",
    name: "FinancialProductClassificationTreeCode",
    type: "AnsiChar",
    length: 10,
    description: "Code of a financial product classification tree.",
  },
  {
    kind: "Array",
    name: "FinancialProductClassificationTreeName",
    type: "AnsiChar",
    length: 50,
    description: "Name of a financial product classification tree.",
  },
  {
    kind: "Array",
    name: "FinancialProductIssuerName",
    type: "AnsiChar",
    length: 150,
    description: "Name of the product's issuer.",
  },
  {
    kind: "Array",
    name: "FisnCode",
    type: "AnsiChar",
    length: 35,
    description: "Financial Instrument Short Name as specified in ISO 10962.",
  },
  {
    kind: "Array",
    name: "Hostname",
    type: "AnsiChar",
    length: 32,
    description: "DNS host name.",
  },
  {
    kind: "Array",
    name: "LeiCode",
    type: "AnsiChar",
    length: 20,
    description: "Legal Entity Identifier as specified in ISO 17422.",
  },
  {
    kind: "Array",
    name: "MarketOperatorName",
    type: "AnsiChar",
    length: 150,
    description: "Name of the market operator.",
  },
  {
    kind: "Array",
    name: "MarketSegmentName",
    type: "AnsiChar",
    length: 50,
    description: "Name of a market segment.",
  },
  {
    kind: "Array",
    name: "MarketSegmentTypeName",
    type: "AnsiChar",
    length: 50,
    description: "Name of the type of market segment.",
  },
  {
    kind: "Array",
    name: "MicCode",
    type: "AnsiChar",
    length: 4,
    description: "Market Identifier Code (MIC) as specified in ISO 10383.",
  },
  {
    kind: "Array",
    name: "ParticipantCode",
    type: "AnsiChar",
    length: 50,
    description: "Participant code.",
  },
  {
    kind: "Array",
    name: "ParticipantName",
    type: "AnsiChar",
    length: 150,
    description: "Participant name.",
  },
  {
    kind: "Array",
    name: "ParticipantTypeName",
    type: "AnsiChar",
    length: 50,
    description: "Name of participant type.",
  },
  {
    kind: "Array",
    name: "ProductIdentification",
    type: "AnsiChar",
    length: 50,
    description: "Product identification, for example its ISIN number.",
  },
  {
    kind: "Array",
    name: "ProductIdentificationTypeName",
    type: "AnsiChar",
    length: 50,
    description: "Name of the given product identification type.",
  },
  {
    kind: "Array",
    name: "ProductName",
    type: "AnsiChar",
    length: 50,
    description: "Name of the product.",
  },
  {
    kind: "Array",
    name: "ProductTypeCode",
    type: "AnsiChar",
    length: 10,
    description: "Code of the product type.",
  },
  {
    kind: "Array",
    name: "ProductTypeName",
    type: "AnsiChar",
    length: 50,
    description: "Name of the product type.",
  },
  {
    kind: "Array",
    name: "ReferencePriceLogicDescription",
    type: "AnsiChar",
    length: 50,
  },
  {
    kind: "Array",
    name: "ReferencePriceLogicName",
    type: "AnsiChar",
    length: 50,
  },
  {
    kind: "Array",
    name: "SettlementCalendarName",
    type: "AnsiChar",
    length: 50,
    description: "Settlement calendar name.",
  },
  {
    kind: "Array",
    name: "TestPayload",
    type: "u8",
    length: 1436,
    description:
      "This is the largest UDP packet the system can work with. The length is 1500 minus message header size (36 b) minus IP and UDP header sizes (28 b) = 1436.",
  },
  {
    kind: "Array",
    name: "TextMessage",
    type: "AnsiChar",
    length: 50,
    description: "A text message.",
  },
  {
    kind: "Array",
    name: "TickTableDescription",
    type: "AnsiChar",
    length: 50,
    description: "Tick table description.",
  },
  {
    kind: "Array",
    name: "TickTableName",
    type: "AnsiChar",
    length: 50,
    description: "Tick table name.",
  },
  {
    kind: "Array",
    name: "Token",
    type: "AnsiChar",
    length: 8,
    description: "Unique token.",
  },
  {
    kind: "Array",
    name: "TradableProductName",
    type: "AnsiChar",
    length: 50,
    description: "Tradable product name.",
  },
  {
    kind: "Array",
    name: "TradingConfigName",
    type: "AnsiChar",
    length: 50,
    description: "Name of the trading configuration.",
  },
  {
    kind: "Array",
    name: "TradingGroupName",
    type: "AnsiChar",
    length: 50,
    description: "Name of the trading group.",
  },
  {
    kind: "Array",
    name: "TradingPhaseDescription",
    type: "AnsiChar",
    length: 50,
    description: "Trading phase description.",
  },
  {
    kind: "Array",
    name: "TradingPhaseName",
    type: "AnsiChar",
    length: 50,
    description: "Trading phase name.",
  },
  {
    kind: "Array",
    name: "TradingPhaseSuspensionComment",
    type: "AnsiChar",
    length: 50,
    description: "Comment to a suspension trading phase.",
  },
  {
    kind: "Array",
    name: "TradingScheduleDescription",
    type: "AnsiChar",
    length: 50,
    description: "Trading schedule description.",
  },
  {
    kind: "Array",
    name: "TradingScheduleName",
    type: "AnsiChar",
    length: 50,
    description: "Trading schedule name.",
  },
  {
    kind: "Array",
    name: "TradingVenueName",
    type: "AnsiChar",
    length: 50,
    description: "Name of the trading venue.",
  },
  {
    kind: "Enum",
    name: "AccountType",
    description: "Account type.",
    underlying: "u8",
    variants: [
      [
        "Missing",
        1,
        "Account is missing. Account is expected to be filled with 0x00.",
      ],
      ["Customer", 2, "Account is carried on customer side of the books."],
      ["House", 3, "House trader."],
    ],
  },
  {
    kind: "Enum",
    name: "AuctionType",
    underlying: "u8",
    variants: [
      ["Auction", 1],
      ["ClosingAuction", 2],
      ["SuspensionLiftAuction", 3],
      ["VolatilityAuctionStatic", 4],
      ["VolatilityAuctionDynamic", 5],
    ],
  },
  {
    kind: "Enum",
    name: "CalendarExceptionType",
    description: "Calendar exception type.",
    underlying: "u8",
    variants: [
      ["HalfDay", 1, "The given trading day is a half-day."],
      ["Closed", 2, "The day is closed for trading."],
      ["Open", 3, "The day is open for trading."],
      [
        "Technical",
        4,
        "Indicates a technical exception to the normal trading schedule.",
      ],
    ],
  },
  {
    kind: "Enum",
    name: "ClearingIdentifier",
    description: "Clearing identifier type.",
    underlying: "u8",
    variants: [
      ["Lei", 1, "Legal Entity Identifier."],
      ["Bic", 2, "Business Identifier Code."],
      ["Custom", 3, "Custom clearing identifier."],
    ],
  },
  {
    kind: "Enum",
    name: "CollarExpression",
    description: "Collar expression type.",
    underlying: "u8",
    variants: [
      ["Percentage", 1, "Percentage of reference price."],
      ["AbsoluteValue", 2, "Absolute value."],
    ],
  },
  {
    kind: "Enum",
    name: "CollarMode",
    description: "Collar mode (trade price collar or order price collar).",
    underlying: "u8",
    variants: [
      ["TradePriceCollar", 1],
      ["OrderPriceCollar", 2],
    ],
  },
  {
    kind: "Enum",
    name: "CollarType",
    underlying: "u8",
    variants: [
      ["StaticTradePriceCollar", 1],
      ["DynamicTradePriceCollar", 2],
      ["StaticOrderPriceCollar", 3],
      ["DynamicOrderPriceCollar", 4],
    ],
  },
  {
    kind: "Enum",
    name: "CouponType",
    underlying: "u8",
    variants: [
      ["Zero", 1],
      ["Fixed", 2],
      ["Floating", 3],
      ["Indexed", 4],
    ],
  },
  {
    kind: "Enum",
    name: "DayOfWeek",
    description: "Enumeration for week days.",
    underlying: "u8",
    variants: [
      ["Monday", 1, "Monday."],
      ["Tuesday", 2, "Tuesday."],
      ["Wednesday", 3, "Wednesday."],
      ["Thursday", 4, "Thursday."],
      ["Friday", 5, "Friday."],
      ["Saturday", 6, "Saturday."],
      ["Sunday", 7, "Sunday."],
    ],
  },
  {
    kind: "Enum",
    name: "DayStatus",
    description: "Day status.",
    underlying: "u8",
    variants: [
      ["Open", 1, "Day is open for trading."],
      ["Closed", 2, "Day is closed for trading."],
    ],
  },
  {
    kind: "Enum",
    name: "IssueSizeType",
    description: "Type of issue size.",
    underlying: "u8",
    variants: [
      ["Quantity", 1, "Issue size expressed in quantity."],
      ["Value", 2, "Issue size expressed as nominal value."],
      ["NoIssueSize", 3, "No issue size."],
    ],
  },
  {
    kind: "Enum",
    name: "LiquidityFlag",
    underlying: "u8",
    variants: [
      ["Yes", 1],
      ["No", 2],
    ],
  },
  {
    kind: "Enum",
    name: "MatchingAlgorithm",
    description: "Types of matching algorithms.",
    underlying: "u8",
    variants: [
      ["ContinuousPriceTime", 1],
      ["ContinuousRefPriceTime", 2],
      ["ContinuousLastAuctionTime", 3],
      ["AuctionPriceTime", 4],
      ["BlockExactMatching", 5],
      ["NoTradingNoTrading", 6],
      ["SuspensionNoTrading", 7],
    ],
  },
  {
    kind: "Enum",
    name: "MifirIdentifier",
    description: "MIFIR identifier types.",
    underlying: "u8",
    variants: [
      ["Eusb", 1, "Allowed for bonds only."],
      ["Oepb", 2, "Allowed for bonds only.\r\n"],
      ["Cvtb", 3, "Allowed for bonds only.\r\n"],
      ["Cvdb", 4, "Allowed for bonds only.\r\n"],
      ["Crpb", 5, "Allowed for bonds only.\r\n"],
      ["Shrs", 6, "Allowed for shares only."],
      ["Etfs", 7, "Allowed for shares only.\r\n"],
      ["Dprs", 8, "Allowed for shares only.\r\n"],
      ["Crft", 9, "Allowed for shares only.\r\n"],
      ["Othr", 10, "Allowed for bonds and shares."],
    ],
  },
  {
    kind: "Enum",
    name: "NominalValueType",
    description: "Indicates the security's nominal value type.",
    underlying: "u8",
    variants: [
      ["NoNominal", 1, "Indicates that the security has no nominal value."],
      [
        "Constant",
        2,
        "Indicates that the security has a constant nominal value.",
      ],
      [
        "Unknown",
        3,
        "Indicates that the security has an unknown nominal value.",
      ],
    ],
  },
  {
    kind: "Enum",
    name: "OrderSide",
    description: "Indicates order side (buy or sell).",
    underlying: "u8",
    variants: [
      ["Buy", 1, "Indicates a buy-side order."],
      ["Sell", 2, "Indicates a sell-side order."],
    ],
  },
  {
    kind: "Enum",
    name: "ParticipantStatus",
    description: "Participant status.",
    underlying: "u8",
    variants: [
      ["Active", 1, "Participant is active."],
      ["Suspended", 2, "Participant is suspended."],
      ["Disabled", 3, "Participant is disabled."],
    ],
  },
  {
    kind: "Enum",
    name: "ParticipationType",
    underlying: "u8",
    variants: [
      ["RegulatedMarketMaker", 1],
      ["IssuerMarketMaker", 2],
      ["AgencyTrading", 3],
      ["PrincipalTrading", 4],
    ],
  },
  {
    kind: "Enum",
    name: "PermissionType",
    description: "Permission type.",
    underlying: "u8",
    variants: [
      ["ViewOnly", 1, "Permission to buy only."],
      ["BuyOnly", 2, "Permission to sell only."],
      ["SellOnly", 3, "Permission to both buy and sell."],
      ["BuySell", 4, "Permission to view only."],
      ["Prohibited", 5, "Prohibited to buy, sell or view."],
    ],
  },
  {
    kind: "Enum",
    name: "PriceExpressionType",
    description: "Price expression type.",
    underlying: "u8",
    variants: [
      ["Price", 1, "Price expressed as an absolute value."],
      ["Percentage", 2, "Price expressed as percentage."],
    ],
  },
  {
    kind: "Enum",
    name: "PriorityFlag",
    description: "Indicates whether the priority flag was lost or retained.",
    underlying: "u8",
    variants: [
      ["Lost", 1, "The priority flag was lost."],
      ["Retained", 2, "The priority flag was retained."],
    ],
  },
  {
    kind: "Enum",
    name: "ReferencePriceType",
    underlying: "u8",
    variants: [
      ["ManualPrice", 1],
      ["AdjustedClosingPrice", 2],
      ["ReferenceAdjustedClosingPrice", 3],
      ["LastAuctionPrice", 4],
      ["ReferenceLastAuctionPrice", 5],
      ["LastTradePrice", 6],
      ["ReferenceLastTradePrice", 7],
      ["VolumeWeightedAveragePrice", 8],
      ["ReferenceVolumeWeightedAveragePrice", 9],
    ],
  },
  {
    kind: "Enum",
    name: "SeniorityBond",
    description: "Type of seniority bond.",
    underlying: "u8",
    variants: [
      ["Unknown", 1, "Unknown bond seniority."],
      ["SeniorDebt", 2, "Senior debt."],
      ["MezzanineDebt", 3, "Mezzanine debt."],
      ["SubordinatedDebt", 4, "Subordinated debt."],
      ["JuniorDebt", 5, "Junior debt."],
    ],
  },
  {
    kind: "Enum",
    name: "SettlementStatus",
    description: "Settlement statuses.",
    underlying: "u8",
    variants: [
      ["Closed", 1],
      ["Open", 2],
    ],
  },
  {
    kind: "Enum",
    name: "TickTableType",
    description: "Type of tick table.",
    underlying: "u8",
    variants: [
      ["Positive", 1, "Indicates a positive tick table."],
      ["Negative", 2, "Indicates a negative tick table."],
      ["Symmetrical", 3, "Indicates a symmetrical tick table."],
    ],
  },
  {
    kind: "Enum",
    name: "TradingPhaseType",
    description: "Types of trading phases.",
    underlying: "u8",
    variants: [
      ["Continuous", 1],
      ["Auction", 2],
      ["Block", 3],
      ["NoTrading", 4],
      ["Suspension", 5],
    ],
  },
  {
    kind: "Enum",
    name: "TradingPortType",
    description: "Type of trading port.",
    underlying: "u8",
    variants: [
      ["FixTrading", 1, "FIX port for trading."],
      ["FixDropCopy", 2, "FIX port for the Drop Copy service."],
      ["FixCcp", 3, "FIX port for communication with a CCP."],
      ["BinaryTrading", 4, "Binary port for trading."],
    ],
  },
  {
    kind: "Enum",
    name: "Uncrossing",
    description: "Types of uncrossing.",
    underlying: "u8",
    variants: [
      ["No", 1],
      ["YesOrVolatilityAuction", 2],
      ["YesOrExtendedVolatilityAuction", 3],
    ],
  },
  {
    kind: "Enum",
    name: "UsIndicator",
    description: "US Regulation S indicator.",
    underlying: "u8",
    variants: [
      ["None", 1, "No trading restrictions."],
      ["RegulationS", 2, "Trading restricted due to US Regulation S."],
      [
        "RegulationSPlusRule144A",
        3,
        "Trading restricted due to US Regulation S with Rule 144A.",
      ],
    ],
  },
  {
    kind: "Enum",
    name: "VolumeType",
    description: "Type of volume.",
    underlying: "u8",
    variants: [
      ["NoValue", 1, "No volume provided."],
      ["Quantity", 2, "Volume given as quantity."],
      ["PercentageOfIssue", 3, "Volume given as percentage of issue."],
    ],
  },
];
