#!/usr/bin/perl

#################################
#
# maze2json.pl
#
# Author: Brandon Blodget <blodget.sw@gmail.com>
# Copyright 2011 Brandon Blodget 
# All rights reserved.
#
# This program converts a ascii text representation
# of a maze into a JSON representation that can 
# be used by the HTML5 Micromouse simulator.
#
# The original ascii mazes are from Jeff Weisberg site
# http://www.tcp4me.com/mmr/mazes/
#
#################################


# Define subroutines
sub usage;

# Check to make  sure there are two arguments
if ($#ARGV != 1) {
	usage;
	exit(1);
}

my ($source_dir, $dest_dir) = @ARGV;

# check to make sure files exist
if (! -d $source_dir) {
	die "$source_dir does not exist.\n";
}
if (! -d $dest_dir) {
	die "$dest_dir does not exist.\n";
}

# Process all the the *.maze files in $source_dir
opendir(DIR,$source_dir) || die "Can't open $source_dir : $!\n";
@filelist = readdir(DIR);
close(DIR);
# drop the . and ..
shift @filelist;
shift @filelist;

while (<@filelist>) {
	if (m/(\w+).maze/i) {
		translate("$source_dir/$_","$dest_dir/$1.json");
	}
}

exit(0);

####################
# Subroutines
####################

# Translate from ascii format to json format.
sub translate {
	my ($in_file,$out_file) = @_;
	my @line;
	my @maze;

	print "$in_file -> $out_file\n";

	open (IN_FILE, "<$in_file") || die "Could not open $in_file\n";
	foreach (<IN_FILE>) {
		@line = split(//);
		push(@maze,[@line]);
	}
	close INFILE;

	open (OUT_FILE, ">$out_file") || die "Could not open $out_file\n";

	print OUT_FILE "[\n";
	for (my $y=1; $y<=$#maze; $y=$y+2) {
		print OUT_FILE "   [";
		for (my $x=1; $x<=$#maze; $x=$x+2) {
			print OUT_FILE '"';
			if ($maze[$y-1][$x] eq " ") { print OUT_FILE "N"; }
			if ($maze[$y][$x+1] eq " ") { print OUT_FILE "E"; }
			if ($maze[$y+1][$x] eq " ") { print OUT_FILE "S"; }
			if ($maze[$y][$x-1] eq " ") { print OUT_FILE "W"; }
			print OUT_FILE '"';
			if ($x<$#maze-1) {print OUT_FILE ", ";}
		}
		print OUT_FILE "]"; 
		if ($y<$#maze-1) {print OUT_FILE ",";}
		print OUT_FILE "\n"; 
	}
	print OUT_FILE "]\n";

	close OUTFILE;
	
}

sub usage {
   die <<"EndUsage";

This program converts a ascii text representation
of a maze into a JSON representation that can 
be used by the HTML5 Micromouse simulator.
It processes all the *.maze files in the source_dir
and generates *.json files that are put in the dest_dir.

The original ascii mazes are from Jeff Weisberg site
http://www.tcp4me.com/mmr/mazes/

usage: maze2json.pl source_dir dest_dir

   source_dir - The directory that contains ascii maze files.
   dest_dir - The directory to put the generated json files.

EndUsage
}

