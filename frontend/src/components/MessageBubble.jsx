import ReactMarkdown from 'react-markdown';
import './MessageBubble.css';

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`message-container ${isUser ? 'user' : 'model'}`}>
      <div className="message-bubble">
        <div className="message-content">
          <ReactMarkdown>{message.text}</ReactMarkdown>
        </div>
        {message.toolsUsed && message.toolsUsed.length > 0 && (
          <div className="tools-used">
            {message.toolsUsed.map((tool, idx) => (
              <span key={idx} className="tool-badge">Used {tool.replace(/_/g, ' ')}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
