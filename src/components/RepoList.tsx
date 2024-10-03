// src/components/RepoList.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface Repo {
  node: {
    name: string;
    url: string;
    stargazerCount: number;
    watchers: {
      totalCount: number;
    };
  };
}

interface Props {
  repositories: Repo[];
  hasNextPage?: boolean;
  endCursor?: string;
  onLoadMore?: () => void;
}

const RepoList: React.FC<Props> = ({ repositories, hasNextPage, endCursor, onLoadMore }) => {
  return (
    <div>
      <ul>
        {repositories.map(({ node }) => (
          <li key={node.name}>
            <Link to={node.url} target="_blank">
              {node.name}
            </Link>
            <p>{node.stargazerCount} stars / {node.watchers.totalCount} watching</p>
          </li>
        ))}
      </ul>
      {hasNextPage && onLoadMore && (
        <button onClick={onLoadMore}>Load More</button>
      )}
    </div>
  );
};

export default RepoList;
