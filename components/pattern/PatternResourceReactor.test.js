import React from 'react';
import {PatternResourceReactor} from './PatternResourceReactor';
import {reactTester} from '../../test/ReactComponentTester'

reactTester.itRendersWithoutExploding(<PatternResourceReactor />, 'PatternResourceReactor')
