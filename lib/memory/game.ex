defmodule Memory.Game do

  def new(gameState) do
  IO.inspect "new"
  IO.inspect gameState
  gameState

end

def reset(gameState) do
  IO.inspect "resetex"
  IO.inspect gameState
  gameState
end

  def cardFlipped(card, state) do
  IO.inspect "frirst"
  IO.inspect card
  if(Map.get(card, "flipped")) do
    IO.inspect "case1"
    clicks = Map.get(state, "clicks")
    clicks = clicks + 1
    state = Map.put(state, "clicks", clicks)

     if (Map.get(state, "currentCardState") == "WAIT_FLIP_FIRST_CARD") do
        IO.inspect "case1"
        cards = Map.get(state, "cards")
        cardRow = Enum.fetch!(Map.get(state, "cards"), Map.get(card, "rowCounter"))
        cardVal = Enum.fetch!(cardRow, Map.get(card, "columnCounter"))


        new_card = Map.put(cardVal, "flipped", true)
        cardRow = List.replace_at(cardRow, Map.get(new_card, "columnCounter"), new_card)
        cards = List.replace_at(cards, Map.get(new_card, "rowCounter"), cardRow)
        state = Map.put(state, "cards", cards)
        %{
        cards: Map.get(state, "cards"), 
        firstCard: card, 
        secondCard: Map.get(state, "secondCard"),
        currentCardState: "WAIT_FLIP_SECOND_CARD",
        clicks: Map.get(state, "clicks")
        }

        else
          if (Map.get(state, "currentCardState") == "WAIT_FLIP_SECOND_CARD") do
          IO.inspect "case2"
          cards = Map.get(state, "cards")
          cardRow = Enum.fetch!(Map.get(state, "cards"), Map.get(card, "rowCounter"))
          cardVal = Enum.fetch!(cardRow, Map.get(card, "columnCounter"))
          new_card = Map.put(cardVal, "flipped", true)
          cardRow = List.replace_at(cardRow, Map.get(new_card, "columnCounter"), new_card)
          cards = List.replace_at(cards, Map.get(new_card, "rowCounter"), cardRow)
          state = Map.put(state, "cards", cards)
          first_card = Map.get(state, "firstCard")
          if(Map.get(first_card, "cardValue") == Map.get(card, "cardValue")) do
            IO.inspect "sachu"
            %{
            cards: Map.get(state, "cards"), 
            secondCard: card, 
            firstCard: Map.get(state, "firstCard"),
            currentCardState: "WAIT_FLIP_FIRST_CARD",
            clicks: Map.get(state, "clicks")
            }

            else
            IO.inspect "khotu"
            %{
            cards: Map.get(state, "cards"), 
            secondCard: card, 
            firstCard: Map.get(state, "firstCard"),
            currentCardState: "TRY_AGAIN",
            clicks: Map.get(state, "clicks")
            }
          
        end


      end

       end  
    

    end
  end



end
