import React from 'react';
import PartOfVisualFrame from '../PartOfVisualFrame';
import {reactTester} from '../../../test/ReactComponentTester'

reactTester.itRendersWithoutExploding(<PartOfVisualFrame />, 'PartOfVisualFrame')