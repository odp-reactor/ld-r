import React from 'react';
import {ImageGrid} from './ImageGrid';
import {reactTester} from '../../test/ReactComponentTester'

reactTester.itRendersWithoutExploding(<ImageGrid />, 'ImageGrid')