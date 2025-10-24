<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Game extends CI_Controller {

	public function __construct() {
		parent::__construct();
		$this->output->set_content_type('application/json');
		$this->load->helper('url');
		$this->load->database();
	}

	private function readJsonBody() {
		$raw = $this->input->raw_input_stream;
		$decoded = json_decode($raw, true);
		return is_array($decoded) ? $decoded : [];
	}

	private function respond($statusCode, $payload) {
		$this->output->set_status_header($statusCode);
		$this->output->set_output(json_encode($payload));
	}

	private function updateWallet($userId, $amount, $transactionType, $description) {
		// Start database transaction
		$this->db->trans_start();
		
		try {
			// Get current wallet balance
			$wallet = $this->db->where('user_id', $userId)->get('wallet')->row();
			if (!$wallet) {
				$this->db->trans_rollback();
				return [
					'success' => false,
					'error' => 'Wallet not found for user: ' . $userId
				];
			}
			
			$balanceBefore = (float) $wallet->amount;
			$balanceAfter = $balanceBefore;
			
			// Calculate new balance based on transaction type
			if ($transactionType === 'CREDIT') {
				$balanceAfter = $balanceBefore + $amount;
			} elseif ($transactionType === 'DEBIT') {
				$balanceAfter = $balanceBefore - $amount;
				// Check for insufficient funds
				if ($balanceAfter < 0) {
					$this->db->trans_rollback();
					return [
						'success' => false,
						'error' => 'Insufficient funds. Current balance: ' . $balanceBefore . ', Required: ' . $amount
					];
				}
			}
			
			// Update wallet balance
			$this->db->where('user_id', $userId)
					->update('wallet', ['amount' => $balanceAfter]);
			
			// Insert transaction record
			$transactionData = [
				'user_id' => $userId,
				'transaction_type' => $transactionType,
				'amount' => $amount,
				'balance_before' => $balanceBefore,
				'balance_after' => $balanceAfter,
				'description' => $description,
				'reference_id' => 'GAME_' . time() . '_' . rand(1000, 9999),
				'mode_of_payment' => 'Game Transaction',
				'status' => 'completed'
			];
			
			$this->db->insert('wallet_transactions', $transactionData);
			$transactionId = $this->db->insert_id();
			
			// Complete transaction
			$this->db->trans_complete();
			
			if ($this->db->trans_status() === FALSE) {
				return [
					'success' => false,
					'error' => 'Database transaction failed'
				];
			}
			
			return [
				'success' => true,
				'transaction_id' => $transactionId,
				'balance_before' => $balanceBefore,
				'balance_after' => $balanceAfter,
				'amount' => $amount
			];
			
		} catch (Exception $e) {
			$this->db->trans_rollback();
			return [
				'success' => false,
				'error' => 'Exception: ' . $e->getMessage()
			];
		}
	}

	private function saveGameHistory($gameType, $outcome, $color, $bigSmall, $number, $players) {
		$data = [
			'period' => date('Y-m-d H:i:s'),
			'game_type' => $gameType,
			'outcome' => $outcome,
			'color' => $color,
			'big_small' => $bigSmall,
			'number' => $number,
			'total_players' => count($players),
			'total_amount' => array_sum(array_column($players, 'amount'))
		];
		
		$this->db->insert('game_history', $data);
		return $this->db->insert_id();
	}

	private function validateGame1Players($players) {
		if (count($players) < 1) {
			return false;
		}
		
		// Check if single user has multiple bet types
		if (count($players) == 1) {
			$userBets = $players[0]['bets'];
			$betTypes = array_keys($userBets);
			return count($betTypes) >= 2;
		}
		
		// Multiple users - each player can have any number of bet types (1 or more)
		// No restriction on bet types across players
		return true;
	}

	private function analyzeGame1Bets($players) {
		$totalBets = [
			'numbers' => [],
			'colors' => [],
			'bigSmall' => []
		];
		
		// Collect all bets
		foreach ($players as $player) {
			$bets = $player['bets'];
			
			// Number bets
			if (isset($bets['number'])) {
				$number = $bets['number']['value'];
				$amount = $bets['number']['amount'];
				if (!isset($totalBets['numbers'][$number])) {
					$totalBets['numbers'][$number] = 0;
				}
				$totalBets['numbers'][$number] += $amount;
			}
			
			// Color bets
			if (isset($bets['color'])) {
				$color = $bets['color']['value'];
				$amount = $bets['color']['amount'];
				if (!isset($totalBets['colors'][$color])) {
					$totalBets['colors'][$color] = 0;
				}
				$totalBets['colors'][$color] += $amount;
			}
			
			// Big/Small bets
			if (isset($bets['bigSmall'])) {
				$side = $bets['bigSmall']['value'];
				$amount = $bets['bigSmall']['amount'];
				if (!isset($totalBets['bigSmall'][$side])) {
					$totalBets['bigSmall'][$side] = 0;
				}
				$totalBets['bigSmall'][$side] += $amount;
			}
		}
		
		// Calculate percentages
		$percentages = [
			'numbers' => [],
			'colors' => [],
			'bigSmall' => []
		];
		
		// Number percentages
		$totalNumberBets = array_sum($totalBets['numbers']);
		if ($totalNumberBets > 0) {
			foreach ($totalBets['numbers'] as $number => $amount) {
				$percentages['numbers'][$number] = $amount / $totalNumberBets;
			}
		}
		
		// Color percentages
		$totalColorBets = array_sum($totalBets['colors']);
		if ($totalColorBets > 0) {
			foreach ($totalBets['colors'] as $color => $amount) {
				$percentages['colors'][$color] = $amount / $totalColorBets;
			}
		}
		
		// Big/Small percentages
		$totalBigSmallBets = array_sum($totalBets['bigSmall']);
		if ($totalBigSmallBets > 0) {
			foreach ($totalBets['bigSmall'] as $side => $amount) {
				$percentages['bigSmall'][$side] = $amount / $totalBigSmallBets;
			}
		}
		
		return $percentages;
	}

	private function generateFavorableNumber($bettingAnalysis) {
		$favoredSides = [];
		
		// Find under-bet sides (< 30%)
		foreach ($bettingAnalysis['numbers'] as $number => $percentage) {
			if ($percentage < 0.30) {
				$favoredSides['numbers'][] = $number;
			}
		}
		
		foreach ($bettingAnalysis['colors'] as $color => $percentage) {
			if ($percentage < 0.30) {
				$favoredSides['colors'][] = $color;
			}
		}
		
		foreach ($bettingAnalysis['bigSmall'] as $side => $percentage) {
			if ($percentage < 0.30) {
				$favoredSides['bigSmall'][] = $side;
			}
		}
		
		// Generate number that favors under-bet sides
		$favorableNumbers = [];
		
		if (!empty($favoredSides['numbers'])) {
			$favorableNumbers = $favoredSides['numbers'];
		}
		
		if (!empty($favoredSides['colors'])) {
			$colorNumbers = $this->getNumbersForColors($favoredSides['colors']);
			if (empty($favorableNumbers)) {
				$favorableNumbers = $colorNumbers;
			} else {
				$favorableNumbers = array_intersect($favorableNumbers, $colorNumbers);
			}
		}
		
		if (!empty($favoredSides['bigSmall'])) {
			$bigSmallNumbers = $this->getNumbersForBigSmall($favoredSides['bigSmall']);
			if (empty($favorableNumbers)) {
				$favorableNumbers = $bigSmallNumbers;
			} else {
				$favorableNumbers = array_intersect($favorableNumbers, $bigSmallNumbers);
			}
		}
		
		// If no favorable numbers, generate random
		if (empty($favorableNumbers)) {
			$favorableNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
		}
		
		return $favorableNumbers[array_rand($favorableNumbers)];
	}

	private function getNumbersForColors($colors) {
		$numberMap = [
			'green' => [1, 3, 5, 9],
			'red' => [0, 2, 4, 6, 7, 8],
			'violet' => [0, 5]
		];
		
		$result = [];
		foreach ($colors as $color) {
			if (isset($numberMap[$color])) {
				$result = array_merge($result, $numberMap[$color]);
			}
		}
		
		return array_unique($result);
	}

	private function getNumbersForBigSmall($sides) {
		$numberMap = [
			'big' => [5, 6, 7, 8, 9],
			'small' => [0, 1, 2, 3, 4]
		];
		
		$result = [];
		foreach ($sides as $side) {
			if (isset($numberMap[$side])) {
				$result = array_merge($result, $numberMap[$side]);
			}
		}
		
		return array_unique($result);
	}

	private function determineGame1Outcomes($generatedNumber) {
		// Determine Big/Small
		$bigSmall = ($generatedNumber >= 5) ? 'BIG' : 'SMALL';
		
		// Determine colors based on your rules
		$colors = [];
		$isGreen = false;
		$isRed = false;
		$isViolet = false;
		
		switch($generatedNumber) {
			case 0:
				$colors = ['RED', 'VIOLET'];
				$isRed = true;
				$isViolet = true;
				break;
			case 1:
			case 3:
			case 9:
				$colors = ['GREEN'];
				$isGreen = true;
				break;
			case 2:
			case 4:
			case 6:
			case 7:
			case 8:
				$colors = ['RED'];
				$isRed = true;
				break;
			case 5:
				$colors = ['GREEN', 'VIOLET'];
				$isGreen = true;
				$isViolet = true;
				break;
		}
		
		return [
			'number' => $generatedNumber,
			'bigSmall' => $bigSmall,
			'colors' => $colors,
			'isGreen' => $isGreen,
			'isRed' => $isRed,
			'isViolet' => $isViolet
		];
	}

	private function calculateGame1PlayerResult($player, $outcomes) {
		$totalWinnings = 0;
		$winningBets = [];
		
		$bets = $player['bets'];
		
		// Check number bet
		if (isset($bets['number']) && $bets['number']['value'] == $outcomes['number']) {
			$amount = $bets['number']['amount'];
			$winnings = $amount * 9; // 9X for number
			$totalWinnings += $winnings;
			$winningBets[] = "Number {$outcomes['number']}: +{$winnings}";
		}
		
		// Check Big bet
		if (isset($bets['bigSmall']) && $bets['bigSmall']['value'] == 'big' && $outcomes['bigSmall'] == 'BIG') {
			$amount = $bets['bigSmall']['amount'];
			$winnings = $amount * 2; // 2X for big
			$totalWinnings += $winnings;
			$winningBets[] = "BIG: +{$winnings}";
		}
		
		// Check Small bet
		if (isset($bets['bigSmall']) && $bets['bigSmall']['value'] == 'small' && $outcomes['bigSmall'] == 'SMALL') {
			$amount = $bets['bigSmall']['amount'];
			$winnings = $amount * 2; // 2X for small
			$totalWinnings += $winnings;
			$winningBets[] = "SMALL: +{$winnings}";
		}
		
		// Check Green bet
		if (isset($bets['color']) && $bets['color']['value'] == 'green' && $outcomes['isGreen']) {
			$amount = $bets['color']['amount'];
			$winnings = $amount * 2; // 2X for green
			$totalWinnings += $winnings;
			$winningBets[] = "GREEN: +{$winnings}";
		}
		
		// Check Red bet
		if (isset($bets['color']) && $bets['color']['value'] == 'red' && $outcomes['isRed']) {
			$amount = $bets['color']['amount'];
			$winnings = $amount * 2; // 2X for red
			$totalWinnings += $winnings;
			$winningBets[] = "RED: +{$winnings}";
		}
		
		// Check Violet bet
		if (isset($bets['color']) && $bets['color']['value'] == 'violet' && $outcomes['isViolet']) {
			$amount = $bets['color']['amount'];
			$winnings = $amount * 4.5; // 4.5X for violet
			$totalWinnings += $winnings;
			$winningBets[] = "VIOLET: +{$winnings}";
		}
		
		return [
			'totalWinnings' => $totalWinnings,
			'winningBets' => $winningBets
		];
	}

	private function calculateTotalBetAmount($bets) {
		$total = 0;
		foreach ($bets as $bet) {
			$total += $bet['amount'];
		}
		return $total;
	}

	// POST /game1/play
	// Body: { "players": [ {"userId": "u1", "bets": {"number": {"value": 5, "amount": 100}, "color": {"value": "green", "amount": 50}, "bigSmall": {"value": "big", "amount": 75}} }, ... ] }
	public function play_game1() {
		$body = $this->readJsonBody();
		$players = isset($body['players']) && is_array($body['players']) ? $body['players'] : [];
		
		// Validate players and bet types
		if (!$this->validateGame1Players($players)) {
			return $this->respond(400, ['error' => 'Invalid game setup. Need minimum 2 players or 1 player with multiple bet types']);
		}
		
		// Analyze all bets using 30%/70% rule
		$bettingAnalysis = $this->analyzeGame1Bets($players);
		
		// Generate favorable number based on analysis
		$generatedNumber = $this->generateFavorableNumber($bettingAnalysis);
		
		// Determine all outcomes for the number
		$outcomes = $this->determineGame1Outcomes($generatedNumber);
		
		// Process winners and losers
		$winners = [];
		$losers = [];
		
		foreach ($players as $p) {
			$playerResult = $this->calculateGame1PlayerResult($p, $outcomes);
			$totalBetAmount = $this->calculateTotalBetAmount($p['bets']);
			
			// Calculate net result (winnings - total bets)
			$netResult = $playerResult['totalWinnings'] - $totalBetAmount;
			
			if ($netResult > 0) {
				// Player made profit - credit the net amount
				$walletResult = $this->updateWallet($p['userId'], $netResult, 'CREDIT', 'Game1 Win');
				$p['walletUpdated'] = isset($walletResult['success']) ? $walletResult['success'] : false;
				$p['transactionId'] = isset($walletResult['transaction_id']) ? $walletResult['transaction_id'] : null;
				$p['netProfit'] = $netResult;
				$p['totalWinnings'] = $playerResult['totalWinnings'];
				$p['totalBets'] = $totalBetAmount;
				$p['winningBets'] = $playerResult['winningBets'];
				$p['walletDebug'] = $walletResult;
				
				$winners[] = $p;
			} else if ($netResult < 0) {
				// Player lost money - debit the net loss
				$walletResult = $this->updateWallet($p['userId'], abs($netResult), 'DEBIT', 'Game1 Loss');
				$p['walletUpdated'] = isset($walletResult['success']) ? $walletResult['success'] : false;
				$p['transactionId'] = isset($walletResult['transaction_id']) ? $walletResult['transaction_id'] : null;
				$p['netLoss'] = abs($netResult);
				$p['totalWinnings'] = $playerResult['totalWinnings'];
				$p['totalBets'] = $totalBetAmount;
				$p['winningBets'] = $playerResult['winningBets'];
				$p['walletDebug'] = $walletResult;
				
				$losers[] = $p;
			} else {
				// Break even - no wallet update needed
				$p['walletUpdated'] = true;
				$p['transactionId'] = null;
				$p['netResult'] = 0;
				$p['totalWinnings'] = $playerResult['totalWinnings'];
				$p['totalBets'] = $totalBetAmount;
				$p['winningBets'] = $playerResult['winningBets'];
				$p['walletDebug'] = ['success' => true, 'message' => 'Break even - no wallet update'];
				
				$winners[] = $p;
			}
		}
		
		// Save game history
		$historyId = $this->saveGameHistory('1', (string)$generatedNumber, implode(',', $outcomes['colors']), $outcomes['bigSmall'], $generatedNumber, $players);
		
		return $this->respond(200, [
			'generatedNumber' => $generatedNumber,
			'outcomes' => $outcomes,
			'winners' => $winners,
			'losers' => $losers,
			'historyId' => $historyId
		]);
	}

	// POST /game2/play
	// Body: { "players": [ {"userId": "u1", "side": "BIG|SMALL", "amount": number }, ... ] }
	public function play_game2() {
		$body = $this->readJsonBody();
		$players = isset($body['players']) && is_array($body['players']) ? $body['players'] : [];
		if (count($players) < 2) {
			return $this->respond(400, [ 'error' => 'At least 2 players required', 'minPlayers' => 2 ]);
		}

		$totalBig = 0.0;
		$totalSmall = 0.0;
		foreach ($players as $p) {
			if (!isset($p['side']) || !isset($p['amount'])) { continue; }
			$side = strtoupper(trim($p['side']));
			$amt = (float) $p['amount'];
			if ($amt < 0) { continue; }
			if ($side === 'BIG') { $totalBig += $amt; }
			elseif ($side === 'SMALL') { $totalSmall += $amt; }
		}

		// Decide range based on which side has lower total amount.
		if ($totalBig === $totalSmall) {
			$generated = rand(0, 9);
		} elseif ($totalSmall < $totalBig) {
			$generated = rand(0, 4); // Favor SMALL when it has less total
		} else {
			$generated = rand(5, 9); // Favor BIG when it has less total
		}

		$winningSide = ($generated >= 5) ? 'BIG' : 'SMALL';

		$winners = [];
		$losers = [];
		
		foreach ($players as $p) {
			if (isset($p['side']) && strtoupper(trim($p['side'])) === $winningSide) {
				$betAmount = (float) $p['amount'];
				$winningAmount = ($betAmount * 2) * 0.98; // 2X with 2% deduction
				$p['winningAmount'] = round($winningAmount, 2);
				
				// Update wallet for winner
				$walletResult = $this->updateWallet($p['userId'], $winningAmount, 'CREDIT', 'Game2 Win');
				$p['walletUpdated'] = isset($walletResult['success']) ? $walletResult['success'] : false;
				$p['transactionId'] = isset($walletResult['transaction_id']) ? $walletResult['transaction_id'] : null;
				$p['walletDebug'] = $walletResult; // Debug info
				
				$winners[] = $p;
			} else {
				// Losers - deduct their bet amount
				$betAmount = (float) $p['amount'];
				$walletResult = $this->updateWallet($p['userId'], $betAmount, 'DEBIT', 'Game2 Loss');
				$p['betAmount'] = $betAmount;
				$p['walletUpdated'] = isset($walletResult['success']) ? $walletResult['success'] : false;
				$p['transactionId'] = isset($walletResult['transaction_id']) ? $walletResult['transaction_id'] : null;
				$p['walletDebug'] = $walletResult; // Debug info
				
				$losers[] = $p;
			}
		}

		// Save game history
		$historyId = $this->saveGameHistory('2', $winningSide, null, $winningSide, null, $players);

		return $this->respond(200, [
			'generatedNumber' => $generated,
			'winningSide' => $winningSide,
			'totalBig' => $totalBig,
			'totalSmall' => $totalSmall,
			'winners' => $winners,
			'losers' => $losers,
			'historyId' => $historyId
		]);
	}

	// POST /game3/play
	// Body: { "players": [ {"userId": "u1", "color": "GREEN|VIOLET|RED", "amount": number }, ... ] }
	public function play_game3() {
		$body = $this->readJsonBody();
		$players = isset($body['players']) && is_array($body['players']) ? $body['players'] : [];
		if (count($players) < 2) {
			return $this->respond(400, [ 'error' => 'At least 2 players required', 'minPlayers' => 2 ]);
		}

		$totalGreen = 0.0;
		$totalViolet = 0.0;
		$totalRed = 0.0;
		
		foreach ($players as $p) {
			if (!isset($p['color']) || !isset($p['amount'])) { continue; }
			$color = strtoupper(trim($p['color']));
			$amt = (float) $p['amount'];
			if ($amt < 0) { continue; }
			if ($color === 'GREEN') { $totalGreen += $amt; }
			elseif ($color === 'VIOLET') { $totalViolet += $amt; }
			elseif ($color === 'RED') { $totalRed += $amt; }
		}

		// Get only colors that were actually chosen by players
		$chosenColors = [];
		foreach ($players as $p) {
			if (isset($p['color'])) {
				$color = strtoupper(trim($p['color']));
				if (!in_array($color, $chosenColors)) {
					$chosenColors[] = $color;
				}
			}
		}
		
		// Calculate totals only for chosen colors
		$totals = [];
		foreach ($chosenColors as $color) {
			if ($color === 'GREEN') $totals['GREEN'] = $totalGreen;
			elseif ($color === 'VIOLET') $totals['VIOLET'] = $totalViolet;
			elseif ($color === 'RED') $totals['RED'] = $totalRed;
		}
		
		// Find minimum total among chosen colors only
		$minTotal = min($totals);
		$favoredColors = [];
		
		foreach ($totals as $color => $total) {
			if ($total === $minTotal) {
				$favoredColors[] = $color;
			}
		}
		
		// Pick randomly from favored colors (guaranteed to be chosen colors)
		$generated = $favoredColors[array_rand($favoredColors)];

		$winners = [];
		$losers = [];
		
		foreach ($players as $p) {
			if (isset($p['color']) && strtoupper(trim($p['color'])) === $generated) {
				$betAmount = (float) $p['amount'];
				$winningAmount = ($betAmount * 2) * 0.98; // 2X with 2% deduction
				$p['winningAmount'] = round($winningAmount, 2);
				
				// Update wallet for winner
				$walletResult = $this->updateWallet($p['userId'], $winningAmount, 'CREDIT', 'Game3 Win');
				$p['walletUpdated'] = isset($walletResult['success']) ? $walletResult['success'] : false;
				$p['transactionId'] = isset($walletResult['transaction_id']) ? $walletResult['transaction_id'] : null;
				$p['walletDebug'] = $walletResult; // Debug info
				
				$winners[] = $p;
			} else {
				// Losers - deduct their bet amount
				$betAmount = (float) $p['amount'];
				$walletResult = $this->updateWallet($p['userId'], $betAmount, 'DEBIT', 'Game3 Loss');
				$p['betAmount'] = $betAmount;
				$p['walletUpdated'] = isset($walletResult['success']) ? $walletResult['success'] : false;
				$p['transactionId'] = isset($walletResult['transaction_id']) ? $walletResult['transaction_id'] : null;
				$p['walletDebug'] = $walletResult; // Debug info
				
				$losers[] = $p;
			}
		}

		// Save game history
		$historyId = $this->saveGameHistory('3', $generated, $generated, null, null, $players);

		return $this->respond(200, [
			'generatedColor' => $generated,
			'totalGreen' => $totalGreen,
			'totalViolet' => $totalViolet,
			'totalRed' => $totalRed,
			'favoredColors' => $favoredColors,
			'winners' => $winners,
			'losers' => $losers,
			'historyId' => $historyId
		]);
	}
}


