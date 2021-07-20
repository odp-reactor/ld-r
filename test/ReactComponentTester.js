import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() }); //enzyme - react 16 hooks support

export class ReactComponentTester {
    itRendersWithoutExploding(component, name) {
        describe(`<${name} />`, () => {
            it('renders without explode', () => {
                shallow(component);
            });
        });
    }
}

const reactTester = new ReactComponentTester()

export {reactTester}