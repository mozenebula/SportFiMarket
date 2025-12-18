'use client'

export default function Header() {
  const connectWallet = () => {
    alert('Connecting to wallet...\n\nThis would integrate with:\n- MetaMask\n- WalletConnect\n- Coinbase Wallet')
  }

  return (
    <header>
      <div className="logo">
        <div className="logo-icon">⚡</div>
        <h1>SportFi Market</h1>
      </div>
      <button className="wallet-btn" onClick={connectWallet}>
        🔗 Connect Wallet
      </button>
    </header>
  )
}

