defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel

 alias Memory.Game

  def join("games:" <> name, payload, socket) do
   


    if authorized?(payload) do

     game = Memory.GameBackup.load(name) || Game.new(payload["game"])
      socket = socket
      |> assign(:game, game)
      |> assign(:name, name)
      {:ok, %{ "game" => game}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("click", payload, socket) do
   
   game = Game.cardFlipped(payload["card"], payload["state"])
   socket = socket
   |> assign(:game, game)
   Memory.GameBackup.save(socket.assigns[:name], game)
   {:reply, {:ok, %{"game" => game}}, socket}
 end


 def handle_in("new", payload, socket) do

   game = Game.new(payload["game"])
   socket = socket
   |> assign(:game, game)
    Memory.GameBackup.save(socket.assigns[:name], game)
   {:reply, {:ok, %{"game" => game}}, socket}
 end

 def handle_in("reset", payload, socket) do

   game = Game.reset(payload["game"])
   socket = socket
   |> assign(:game, game)
    Memory.GameBackup.save(socket.assigns[:name], game)
   {:reply, {:ok, %{"game" => game}}, socket}
 end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do

    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (games:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
