# dts-paths-to-relative

Transform this...
```
import React from 'react';
import { Types } from 'types';
import { Utils } from 'utils';
```

... into this...
```
import React from 'react';
import { Types } from './types';
import { Utils } from './utils';
```

... to make your `.d.ts` work.
