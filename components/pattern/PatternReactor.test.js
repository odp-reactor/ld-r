import React from 'react';
import PatternReactor from './PatternReactor';
import {reactTester} from '../../test/ReactComponentTester'

reactTester.itRendersWithoutExploding(<PatternReactor />, 'PatternReactor')

