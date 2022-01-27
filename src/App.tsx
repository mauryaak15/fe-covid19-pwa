import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {Home} from '@pages';
import {EventBus} from '@utils';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import store, {persistor} from '@store';

const App = () => {
    React.useEffect(() => {
        const toggleDarkMode = () => {
            document.querySelector('html')?.classList.toggle('dark');
        };

        EventBus.getInstance().addListener('ToggleDarkMode', toggleDarkMode);

        return () => {
            EventBus.getInstance().removeListener(toggleDarkMode);
        };
    }, []);

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                    </Routes>
                </BrowserRouter>
            </PersistGate>
        </Provider>
    );
};

export default App;
