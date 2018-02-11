//attribution
// https://www.youtube.com/watch?v=-AbaV3nrw6E&list=PL6gx4Cwl9DGBuKtLgPR_zWYnrwv-JllpA
// http://blog.krawaller.se/posts/a-react-js-case-study-follow-up/
// https://github.com/liamqma/react-memory-game

import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import classnames from 'classnames';


export default function run_demo(root, channel) {
  ReactDOM.render(<Demo width={4} height={4} channel = {channel}/>, root);
}


const cardStates = {WFFC: "WAIT_FLIP_FIRST_CARD", WFSC: "WAIT_FLIP_SECOND_CARD", TRY_AGAIN: "TRY_AGAIN"};


function shuffleArray(a){
  var j, x, i;
  for(i=a.length; i; i--){
    j=Math.floor(Math.random() * i);
    x=a[i-1];
    a[i-1] = a[j];
    a[j] = x;
  }
}

function generateArray(x,y){
  return Array.apply(null, Array(x)).map(function(e){

      return Array(y);
    });
  }


class Card extends React.Component{
  
  
  render(){

  var matchCard1 = "x";
  var matchCard2 = "y";
  if(this.props.root.state.firstCard != null && this.props.root.state.secondCard != null)
  {  matchCard1 = this.props.root.state.firstCard.cardValue;
    matchCard2 = this.props.root.state.secondCard.cardValue;
   
  }

  
 
var classes = classnames(
    'card1',
      {'card1--flipped':this.props.card.flipped}
      //{'card1--matchfound': this.props.card.flipped && (matchCard1 == matchCard2) && (this.props.root.state.firstCard != null)}
      );

  var cardVal=this.props.card.flipped?this.props.card.cardValue:"#";
  return(

    <div className={classes} onClick={()=>this.props.root.cardFlipped(this.props.card)}><span >
    {cardVal}
    </span>
    </div>


    );
  }
}

var timeVar = 0;
var clicks = 0;

class Demo extends React.Component {
  
  
  cardFlipped(card){
  
  if(!card.flipped){
    clicks ++;
    switch(this.state.currentCardState){
      case cardStates.WFFC:
        this.state.cards[card.rowCounter][card.columnCounter].flipped=true;
        this.setState({cards: this.state.cards, firstCard: card, currentCardState: cardStates.WFSC});

        break;

      case cardStates.WFSC:
        this.state.cards[card.rowCounter][card.columnCounter].flipped=!this.state.cards[card.rowCounter][card.columnCounter].flipped;
        if(this.state.firstCard.cardValue == card.cardValue){
            this.setState({currentCardState: cardStates.WFFC, cards: this.state.cards, firstCard:this.state.firstCard, secondCard:card});
          }else{

            this.setState({currentCardState: cardStates.TRY_AGAIN, cards: this.state.cards, secondCard: card});
            timeVar = setTimeout(
              () =>{
                  this.state.cards[this.state.firstCard.rowCounter][this.state.firstCard.columnCounter].flipped=false;
                  this.state.cards[this.state.secondCard.rowCounter][this.state.secondCard.columnCounter].flipped=false;
                  this.setState({currentCardState: cardStates.WFFC, cards: this.state.cards, firstCard:null, secondCard: null});

              }, 1000);
          }
        break;

        case cardStates.TRY_AGAIN:

          clearTimeout(timeVar);
          this.state.cards[this.state.firstCard.rowCounter][this.state.firstCard.columnCounter].flipped=false;
          this.state.cards[this.state.secondCard.rowCounter][this.state.secondCard.columnCounter].flipped=false;
          this.state.cards[card.rowCounter][card.columnCounter].flipped=true;
          this.setState({cards: this.state.cards, currentCardState: cardStates.WFSC, firstCard: card});
        break;
    }
    

    }
  }

  constructor(props){
  super(props);
  this.channel = props.channel;
  this.channel.join()
    .receive("ok", this.gotView.bind(this))
    .receive("error", resp => { console.log("Unable to join", resp) });
  this.reset = this.reset.bind(this);
  var cards = generateArray(props.height, props.width);
  var cardLetters = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'];

  shuffleArray(cardLetters);
  for(var rowCounter = 0; rowCounter<props.height; rowCounter++){
    for(var columnCounter=0; columnCounter<props.width; columnCounter++){
      cards[rowCounter][columnCounter] = {cardValue: cardLetters[rowCounter*props.width+columnCounter], flipped: false, rowCounter: rowCounter, columnCounter: columnCounter}
    }
  }
  this.state={cards: cards, currentCardState: cardStates.WFFC, firstCard: null, secondCard: null, clicks: 0};
  this.channel.push("new", {game: this.state}).receive("ok", resp => {this.gotView(this.state)});
  }
  
gotView(msg){
  //console.log("Got view", msg);
  this.setState(msg.game);
}

reset(){
clicks = 0;
var cards = generateArray(4, 4);
 var cardLetters = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'];

  shuffleArray(cardLetters);
  for(var rowCounter = 0; rowCounter<4; rowCounter++){
    for(var columnCounter=0; columnCounter<4; columnCounter++){
      cards[rowCounter][columnCounter] = {cardValue: cardLetters[rowCounter*4+columnCounter], flipped: false, rowCounter: rowCounter, columnCounter: columnCounter}
    }

  }

  
  this.setState(
    {
    clicks: 0,
    cards: cards,
    currentCardState: cardStates.WFFC,
    firstCard: null,
    secondCard: null
    });

  this.channel.push("reset", {game: this.state}).receive("ok", resp => {this.gotView(this.state)});
}

 

  render() {
    const cardsDepict = this.state.cards.map((rowOfCards, rowCounter)=><div className="row">{rowOfCards.map((card, indexOfCardInRow)=><div onClick={()=>this.channel.push("click", {card: card, state: this.state}).receive("ok", resp => {this.gotView(resp)})} className="col-md cardCol">
      <Card card = {card}  root={this}/></div>)}</div>);
    return (
      
      <div className="container" align="center">

      {cardsDepict}
      <div className="row">
        <div className="number-clicks"> <p>Number of clicks: <strong>{this.state.clicks}</strong></p> </div>
        <div className="reset-btn" onClick={this.reset}>Reset</div>
   
      </div>
      </div>
    );
  }
}

