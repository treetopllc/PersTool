import React from 'react';
import styled from 'styled-components';

const FlexContainer = styled.div`
    display: flex;
    min-height: 500px;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
`;

export default function Home() {
  return (
    <FlexContainer>
      <p><strong className="green">Ready to roll up your sleeves to tackle Oregon&rsquo;s intractable budget woes? This calculator provides three options to get started.</strong></p>

      <p>This stuff is complicated. We&rsquo;ve made choices to simplify it so that every day people like us can visualize our options and start having more open and factual conversations about the challenges we face &ndash;&ndash; and how we can solve them together. If you have questions about how this works, please check out our Assumptions or send an email to our Research Associate, Marina.</p>

    </FlexContainer>
  );
}
