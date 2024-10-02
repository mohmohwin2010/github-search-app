// src/components/IssueList.tsx
import React from 'react';

interface Issue {
  node: {
    title: string;
    number: number;
    url: string;
    createdAt: string;
    author: {
      login: string;
    };
  };
}

interface Props {
  issues: Issue[];
}

const IssueList: React.FC<Props> = ({ issues }) => {
  return (
    <ul>
      {issues.map(({ node }) => (
        <li key={node.number}>
          <a href={node.url} target="_blank" rel="noopener noreferrer">
            #{node.number} - {node.title}
          </a>
          <p>
            Created by {node.author.login} on {new Date(node.createdAt).toLocaleDateString()}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default IssueList;
