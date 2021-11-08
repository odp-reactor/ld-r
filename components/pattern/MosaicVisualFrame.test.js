import React from 'react';
import MosaicVisualFrame from './MosaicVisualFrame';
import {reactTester} from '../../test/ReactComponentTester'

reactTester.itRendersWithoutExploding(<MosaicVisualFrame />, 'MosaicVisualFrame')

