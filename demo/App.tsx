import React from 'react';
import { Message, useMessage } from 'twist-message';

function App() {
  const [api, contextHolder] = useMessage({ maxCount: 3, duration: 2000 });
  const ConfigContext = React.createContext({});

  Message.config({
    duration: 2000
  });

  const useMessageInfo = () => {
    api.info({
      content: (
        <ConfigContext.Consumer>
          {(name) => `Current user: ${name}`}
        </ConfigContext.Consumer>
      )
    });
  };

  const useMessageSuccess = () => {
    api.success('useMessage Success');
  };

  return (
    <div>
      <ConfigContext.Provider value='RAZZH'>
        <div>
          <h3>hooks 调用</h3>
          {contextHolder}
          <button onClick={useMessageInfo}>useMessage Info</button>
          <button onClick={useMessageSuccess}>useMessage Success</button>
        </div>
        <div>
          <h3>静态方法调用</h3>
          <button onClick={() => {
            Message.info('Message Info')
          }}>
            Info
          </button>
          <button onClick={() => {
            Message.success('Message Success')
          }}>
              Success
          </button>
          <button onClick={() => {
            Message.warning('Message Warning')
          }}>
            Warning
          </button>
          <button onClick={() => {
            Message.error({
              content: 'Message Error',
              duration: 0,
              closable: true
            })
          }}>
            Error
         </button>
          <button onClick={() => {
            Message.loading({
              content: 'Message Loading',
              duration: 0
            })
          }}>
            Loading
         </button>
        </div>
      </ConfigContext.Provider>
    </div>
  );
}

export default App;
