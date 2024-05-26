import React from 'react';
import useMessage from '../components/Message/useMessage';
import Message from '../components/Message';

function App() {
  const [api, contextHolder] = useMessage({ maxCount: 3 });
  const ConfigContext = React.createContext({});

  Message.config({
    duration: 1000
  });

  const useMessageInfo = () => {
    api.info({
      content: <ConfigContext.Consumer>{(name) => `Current user: ${name}`}</ConfigContext.Consumer>,
      duration: 2000
    });
  };

  const useMessageSuccess = () => {
    api.success({
      content: 'useMessage Success',
      duration: 0
    });
  };

  const messageStatic = () => {
    Message.info({
      content: 'hahha',
      duration: 2000
    });
  };

  return (
    <div>
      <ConfigContext.Provider value='RAZZH'>
        {contextHolder}
        <button onClick={useMessageInfo}>useMessage Info</button>
        <button onClick={useMessageSuccess}>useMessage Success</button>
        <button onClick={messageStatic}>Message Static</button>
      </ConfigContext.Provider>
    </div>
  );
}

export default App;
