## Usage

```javascript
import { promises } from 'fs';
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
