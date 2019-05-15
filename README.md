# modify-xml

> An easy way to modify XML documents without changing the formatting of the original.
> This module is part of the [atscm](https://github.com/atSCM/atscm) project.
>
> **This module is still under development, do not use it in production yet**

[![CircleCI](https://circleci.com/gh/atSCM/modify-xml.svg?style=svg)](https://circleci.com/gh/atSCM/modify-xml)

## Installation

As usual, run `npm i modify-xml`.

## Usage

```javascript
import { parse, render } from 'modify-xml';

const xml = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<script>
  <metadata>
    <parameter name="stringParam" type="string" trigger="false" relative="false" value="Sample string" />
    <parameter name="numberParam" type="number" trigger="false" relative="false" value="0" />
  </metadata>
  <code><![CDATA[/*
 * Yes, it supports cdata
 */]]></code>
</script>`;

// Parse the XML string
const document = parse(xml);

// Process the resulting document

// Render the document back to XML using two spaces as indent
const result = render(document, { indent: '  ' });
```
