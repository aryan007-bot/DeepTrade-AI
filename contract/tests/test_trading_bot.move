// Module: trading_bot_addr::trading_bot_tests
// Description: Test cases for the trading_bot module
module trading_bot_addr::trading_bot_tests {
    use aptos_framework::signer;
    use aptos_framework::account;
    use aptos_framework::event;
    use aptos_std::string::String;
    use aptos_std::vector;
    use aptos_std::timestamp;
    use trading_bot_addr::trading_bot;

    // Test initialization of the module
    #[test_only]
    public fun test_init_module() {
        let sender = &signer::create_signer(0x100);
        trading_bot::init_module_for_test(sender);
        assert!(trading_bot::exists<TradingBotRegistry>(sender), 0);
        assert!(trading_bot::exists<TradingBotEvents>(sender), 0);
    }

    // Test creating a new bot with valid parameters
    #[test_only]
    public fun test_create_bot_valid() {
        let sender = &signer::create_signer(0x101);
        trading_bot::init_module_for_test(sender);
        let name = String::utf8("TestBot".to_vec());
        let strategy = String::utf8("mean_reversion".to_vec());
        let initial_balance = 1000000; // 1 USDC
        trading_bot::create_test_bot(sender, name, strategy, initial_balance);
        assert!(trading_bot::exists<TradingBot>(sender), 0);
    }

    // Test creating a bot with invalid parameters
    #[test_only]
    public fun test_create_bot_invalid_params() {
        let sender = &signer::create_signer(0x102);
        trading_bot::init_module_for_test(sender);
        let name = String::utf8("".to_vec()); // Empty name
        let strategy = String::utf8("mean_reversion".to_vec());
        let initial_balance = 1000000; // 1 USDC
        assert!(trading_bot::create_test_bot(sender, name, strategy, initial_balance) == trading_bot::EINVALID_TRADE_PARAMS, 0);
    }

    // Test executing a trade with valid parameters
    #[test_only]
    public fun test_execute_trade_valid() {
        let sender = &signer::create_signer(0x103);
        trading_bot::init_module_for_test(sender);
        let name = String::utf8("TestBot".to_vec());
        let strategy = String::utf8("mean_reversion".to_vec());
        let initial_balance = 1000000; // 1 USDC
        trading_bot::create_test_bot(sender, name, strategy, initial_balance);
        let trade_type = 1; // Sell
        let amount = 100000; // 0.1 USDC
        let price = 1000000; // 1 USDC
        trading_bot::execute_trade(sender, trade_type, amount, price);
        let (owner, name, strategy, balance, performance, total_loss, active, total_trades, created_at) = trading_bot::get_bot(sender);
        assert!(balance == initial_balance + amount, 0);
        assert!(total_trades == 1, 0);
    }

    // Test executing a trade with invalid parameters
    #[test_only]
    public fun test_execute_trade_invalid_params() {
        let sender = &signer::create_signer(0x104);
        trading_bot::init_module_for_test(sender);
        let name = String::utf8("TestBot".to_vec());
        let strategy = String::utf8("mean_reversion".to_vec());
        let initial_balance = 1000000; // 1 USDC
        trading_bot::create_test_bot(sender, name, strategy, initial_balance);
        let trade_type = 2; // Invalid trade type
        let amount = 100000; // 0.1 USDC
        let price = 1000000; // 1 USDC
        assert!(trading_bot::execute_trade(sender, trade_type, amount, price) == trading_bot::EINVALID_TRADE_PARAMS, 0);
    }

    // Test executing a trade exceeding risk limits
    #[test_only]
    public fun test_execute_trade_risk_limit_exceeded() {
        let sender = &signer::create_signer(0x105);
        trading_bot::init_module_for_test(sender);
        let name = String::utf8("TestBot".to_vec());
        let strategy = String::utf8("mean_reversion".to_vec());
        let initial_balance = 1000000; // 1 USDC
        trading_bot::create_test_bot(sender, name, strategy, initial_balance);
        let trade_type = 1; // Sell
        let amount = 2000000; // Exceeds max position size
        let price = 1000000; // 1 USDC
        assert!(trading_bot::execute_trade(sender, trade_type, amount, price) == trading_bot::ERISK_LIMIT_EXCEEDED, 0);
    }

    // Test updating the leaderboard
    #[test_only]
    public fun test_update_leaderboard() {
        let sender = &signer::create_signer(0x106);
        trading_bot::init_module_for_test(sender);
        let name = String::utf8("TestBot".to_vec());
        let strategy = String::utf8("mean_reversion".to_vec());
        let initial_balance = 1000000; // 1 USDC
        trading_bot::create_test_bot(sender, name, strategy, initial_balance);
        let trade_type = 1; // Sell
        let amount = 100000; // 0.1 USDC
        let price = 1000000; // 1 USDC
        trading_bot::execute_trade(sender, trade_type, amount, price);
        let leaderboard = trading_bot::get_leaderboard();
        assert!(vector::length(leaderboard) == 1, 0);
    }

    // Test retrieving bot information
    #[test_only]
    public fun test_get_bot_info() {
        let sender = &signer::create_signer(0x107);
        trading_bot::init_module_for_test(sender);
        let name = String::utf8("TestBot".to_vec());
        let strategy = String::utf8("mean_reversion".to_vec());
        let initial_balance = 1000000; // 1 USDC
        trading_bot::create_test_bot(sender, name, strategy, initial_balance);
        let (owner, name, strategy, balance, performance, total_loss, active, total_trades, created_at) = trading_bot::get_bot(sender);
        assert!(owner == signer::address_of(sender), 0);
        assert!(name == "TestBot", 0);
        assert!(strategy == "mean_reversion", 0);
        assert!(balance == initial_balance, 0);
        assert!(active == true, 0);
    }

    // Test retrieving bot risk settings
    #[test_only]
    public fun test_get_bot_risk_settings() {
        let sender = &signer::create_signer(0x108);
        trading_bot::init_module_for_test(sender);
        let name = String::utf8("TestBot".to_vec());
        let strategy = String::utf8("mean_reversion".to_vec());
        let initial_balance = 1000000; // 1 USDC
        trading_bot::create_test_bot(sender, name, strategy, initial_balance);
        let (max_position_size, stop_loss_percent, max_trades_per_day, max_daily_loss) = trading_bot::get_bot_risk_settings(sender);
        assert!(max_position_size == 1000000, 0);
        assert!(stop_loss_percent == 10, 0);
        assert!(max_trades_per_day == 20, 0);
        assert!(max_daily_loss == 500000, 0);
    }

    // Test retrieving global registry statistics
    #[test_only]
    public fun test_get_registry_stats() {
        let sender = &signer::create_signer(0x109);
        trading_bot::init_module_for_test(sender);
        let name = String::utf8("TestBot".to_vec());
        let strategy = String::utf8("mean_reversion".to_vec());
        let initial_balance = 1000000; // 1 USDC
        trading_bot::create_test_bot(sender, name, strategy, initial_balance);
        let (total_bots, total_volume) = trading_bot::get_registry_stats();
        assert!(total_bots == 1, 0);
        assert!(total_volume == 0, 0); // No trades executed yet
    }
}