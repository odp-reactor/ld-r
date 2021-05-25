import React from 'react';
import CollectionVisualFrame from '../CollectionVisualFrame';
import {reactTester} from '../../../test/ReactComponentTester'

reactTester.itRendersWithoutExploding(<CollectionVisualFrame />, 'CollectionVisualFrame')