import ChatInterface from './components/ChatInterface';
import TimelineView from './components/TimelineView';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <TimelineView />
      <ChatInterface />
    </div>
  );
}

export default App;
