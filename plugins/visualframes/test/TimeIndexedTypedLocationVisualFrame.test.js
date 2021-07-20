import React from 'react';
import TimeIndexedTypedLocationVisualFrame from '../TimeIndexedTypedLocationVisualFrame';
import {reactTester} from '../../../test/ReactComponentTester'

reactTester.itRendersWithoutExploding(<TimeIndexedTypedLocationVisualFrame />, 'TimeIndexedTypedLocationVisualFrame')